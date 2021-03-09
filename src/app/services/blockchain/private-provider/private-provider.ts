import Web3 from 'web3';
import { BLOCKCHAIN_NAME, IBlockchain } from '../types/Blockchain';
import { Subject } from 'rxjs';

export abstract class PrivateProvider {
  /**
   * @description an instance of web3 to access the blockchain
   */
  public abstract readonly web3: Web3;

  /**
   * @description default value for transactions gasLimit. Required for tests provider stub
   */
  public readonly defaultGasLimit: string | undefined = undefined;

  /**
   * @description observable address of the selected wallet
   */
  public abstract readonly onAddressChanges: Subject<string>;

  /**
   * @description observable value of the network id and name
   */
  public abstract readonly onNetworkChanges: Subject<IBlockchain>;

  /**
   * @description is the blockchain provider installed
   */
  abstract get isInstalled(): boolean;

  /**
   * @description is the blockchain provider activated
   */
  abstract get isActive(): boolean;

  /**
   * @description current selected wallet address
   * @return current selected wallet address or undefined if isActive is false
   */
  get address(): string {
    if (!this.isActive) {
      return undefined;
    }
    this.getAddress();
  }

  protected abstract getAddress(): string;

  /**
   * @description current selected network
   * @return current selected network or undefined if isActive is false
   */
  get network(): IBlockchain {
    if (!this.isActive) {
      return undefined;
    }
    this.getNetwork();
  }

  protected abstract getNetwork(): IBlockchain;

  /**
   * @description current selected network name
   * @return current selected network name or undefined if isActive is false
   */
  get networkName(): BLOCKCHAIN_NAME {
    return this.network?.name;
  }

  /**
   * @description activate the blockchain provider
   */
  public abstract async activate(): Promise<void>;
}
