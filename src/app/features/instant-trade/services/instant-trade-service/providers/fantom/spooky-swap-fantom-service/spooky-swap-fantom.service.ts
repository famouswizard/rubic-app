import { Injectable } from '@angular/core';
import { CommonUniswapV2Service } from 'src/app/features/instant-trade/services/instant-trade-service/providers/common/uniswap-v2/common-service/common-uniswap-v2.service';
import { SPOOKY_SWAP_FANTOM_CONSTANTS } from 'src/app/features/instant-trade/services/instant-trade-service/providers/fantom/spooky-swap-fantom-service/spooky-swap-fantom.constants';
import { INSTANT_TRADES_PROVIDERS } from '@shared/models/instant-trade/instant-trade-providers';

@Injectable({
  providedIn: 'root'
})
export class SpookySwapFantomService extends CommonUniswapV2Service {
  public readonly providerType = INSTANT_TRADES_PROVIDERS.SPOOKYSWAP;

  constructor() {
    super(SPOOKY_SWAP_FANTOM_CONSTANTS);
  }
}
