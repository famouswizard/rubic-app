import { Injectable } from '@angular/core';
import { TransactionReceipt } from 'web3-eth';
import { EthLikeWeb3Public } from 'src/app/core/services/blockchain/blockchain-adapters/eth-like/web3-public/eth-like-web3-public';
import { PublicBlockchainAdapterService } from '@app/core/services/blockchain/blockchain-adapters/public-blockchain-adapter.service';
import { StoreService } from '@core/services/store/store.service';
import { BehaviorSubject, from, map, switchMap } from 'rxjs';
import { RecentTrade } from '../models/my-trades/recent-trades.interface';
import { asyncMap } from '../utils/utils';
import { AuthService } from '@app/core/services/auth/auth.service';
import { CcrProviderType } from '../models/swaps/ccr-provider-type.enum';
import { CELER_CONTRACT_ABI } from '@app/features/swaps/features/cross-chain-routing/services/cross-chain-routing-service/celer/constants/CELER_CONTRACT_ABI';
import { CELER_CONTRACT } from '@app/features/swaps/features/cross-chain-routing/services/cross-chain-routing-service/celer/constants/CELER_CONTRACT';
import networks, { Network } from '../constants/blockchain/networks';
import { BlockchainName, EthLikeBlockchainName } from '../models/blockchain/blockchain-name';
import { CelerSwapStatus } from '@app/features/swaps/features/cross-chain-routing/services/cross-chain-routing-service/celer/models/celer-swap-status.enum';
import { CROSS_CHAIN_PROD } from 'src/environments/constants/cross-chain';
import { AbiItem } from 'web3-utils';

const MAX_LATEST_TRADES = 3;

const PROCESSED_TRANSACTION_METHOD_ABI: AbiItem[] = [
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'processedTransactions',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
];

@Injectable({
  providedIn: 'root'
})
export class RecentTradesService {
  get recentTradesLS(): { [address: string]: RecentTrade[] } {
    return this.storeService.fetchData().recentTrades;
  }

  get unreadTradesLS(): { [address: string]: number } {
    return this.storeService.fetchData().unreadTrades;
  }

  get userAddress(): string {
    return this.authService.userAddress;
  }

  private readonly _recentTrades$ = new BehaviorSubject<{ [address: string]: RecentTrade[] }>(
    this.recentTradesLS
  );

  public readonly recentTrades$ = this._recentTrades$.asObservable().pipe(
    map(async trades => {
      const usersTrades = trades?.[this.userAddress] || [];
      return usersTrades?.length > 0
        ? await asyncMap(usersTrades, this.parseTradeForUi.bind(this))
        : [];
    }),
    switchMap(result => from(result))
  );

  private readonly _unreadTrades$ = new BehaviorSubject<{ [address: string]: number }>(
    this.unreadTradesLS
  );

  public readonly unreadTrades$ = this._unreadTrades$
    .asObservable()
    .pipe(map(unreadTrades => unreadTrades?.[this.userAddress] || 0));

  constructor(
    private readonly storeService: StoreService,
    private readonly web3Public: PublicBlockchainAdapterService,
    private readonly authService: AuthService
  ) {}

  public saveTrade(address: string, tradeData: RecentTrade): void {
    let currentUsersTrades = [...(this.recentTradesLS?.[address] || [])];

    if (currentUsersTrades?.length === MAX_LATEST_TRADES) {
      currentUsersTrades.pop();
    }
    currentUsersTrades.unshift(tradeData);

    const updatedTrades = { ...this.recentTradesLS, [address]: currentUsersTrades };

    this.storeService.setItem('recentTrades', updatedTrades);
    this._recentTrades$.next(updatedTrades);
    this.updateUnreadTrades();
  }

  public reloadTrades(): void {
    this._recentTrades$.next(this.recentTradesLS);
  }

  private async parseTradeForUi(trade: RecentTrade): Promise<unknown> {
    const { srcTxHash, crossChainProviderType } = trade;
    const sourceWeb3Provider = this.web3Public[trade.fromBlockchain] as EthLikeWeb3Public;
    const dstWeb3Provider = this.web3Public[trade.toBlockchain] as EthLikeWeb3Public;
    const srcTransactionReceipt = await sourceWeb3Provider.getTransactionReceipt(srcTxHash);

    if (crossChainProviderType === CcrProviderType.CELER) {
      return await this.parseCelerTrade(dstWeb3Provider, srcTransactionReceipt, trade);
    }

    if (crossChainProviderType === CcrProviderType.RUBIC) {
      return await this.parseRubicTrade(dstWeb3Provider, srcTransactionReceipt, trade);
    }
  }

  private async parseCelerTrade(
    dstWeb3Provider: EthLikeWeb3Public,
    srcTransactionReceipt: TransactionReceipt,
    trade: RecentTrade
  ): Promise<unknown> {
    const { fromToken, toToken, timestamp, fromBlockchain, toBlockchain, crossChainProviderType } =
      trade;
    const celerMessageId = srcTransactionReceipt.logs.pop().data.slice(0, 66);
    const dstTransactionStatus = await dstWeb3Provider.callContractMethod(
      CELER_CONTRACT[toBlockchain as EthLikeBlockchainName],
      CELER_CONTRACT_ABI,
      'txStatusById',
      {
        methodArguments: [celerMessageId]
      }
    );

    return {
      timestamp,
      crossChainProviderType,
      fromBlockchain: this.getFullBlockchainInfo(fromBlockchain),
      toBlockchain: this.getFullBlockchainInfo(fromBlockchain),
      fromToken,
      toToken,
      srcTransactionStatus: srcTransactionReceipt.status ? 'SUCCEEDED' : 'FAIL',
      dstTransactionStatus: Object.keys(CelerSwapStatus).slice(4, 8)[Number(dstTransactionStatus)]
    };
  }

  private async parseRubicTrade(
    dstWeb3Provider: EthLikeWeb3Public,
    srcTransactionReceipt: TransactionReceipt,
    trade: RecentTrade
  ): Promise<unknown> {
    const { fromToken, toToken, fromBlockchain, toBlockchain, timestamp, crossChainProviderType } =
      trade;
    const srcTransactionStatus = srcTransactionReceipt.status ? 'SUCCEEDED' : 'FAIL';
    const dstTransactionStatus = await dstWeb3Provider.callContractMethod(
      CROSS_CHAIN_PROD.contractAddresses[toBlockchain],
      PROCESSED_TRANSACTION_METHOD_ABI,
      'processedTransactions',
      { methodArguments: [srcTransactionReceipt.transactionHash] }
    );

    return {
      fromBlockchain: this.getFullBlockchainInfo(fromBlockchain),
      toBlockchain: this.getFullBlockchainInfo(toBlockchain),
      fromToken,
      toToken,
      srcTransactionStatus,
      dstTransactionStatus: Boolean(Number(dstTransactionStatus)) ? 'SUCCESS' : 'FAIL',
      timestamp,
      crossChainProviderType
    };
  }

  private getFullBlockchainInfo(blockchain: BlockchainName): Network {
    return networks.find(network => network.name === blockchain);
  }

  public updateUnreadTrades(readAll = false): void {
    const currentUsersUnreadTrades = this.unreadTradesLS?.[this.userAddress] || 0;

    const update = (value: { [address: string]: number }): void => {
      this.storeService.setItem('unreadTrades', value);
      this._unreadTrades$.next(value);
    };

    if (readAll) {
      if (currentUsersUnreadTrades !== 0) update({ ...this.unreadTradesLS, [this.userAddress]: 0 });
      return;
    }

    if (currentUsersUnreadTrades === 3) {
      return;
    }

    update({
      ...this.unreadTradesLS,
      [this.userAddress]: currentUsersUnreadTrades + 1
    });
  }
}
