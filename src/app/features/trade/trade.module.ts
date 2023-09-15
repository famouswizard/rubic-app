import { NgModule } from '@angular/core';
import { TradePageComponent } from '@features/trade/components/trade-page/trade-page.component';
import { TradeRoutingModule } from '@features/trade/trade-routing.module';
import { SwapsStateService } from '@features/trade/services/swaps-state/swaps-state.service';
import { SwapsFormService } from '@features/trade/services/swaps-form/swaps-form.service';
import { SwapsControllerService } from '@features/trade/services/swaps-controller/swaps-controller.service';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { ProvidersListComponent } from './components/providers-list/providers-list.component';
import { ProviderElementComponent } from './components/provider-element/provider-element.component';
import { SwapFormQueryService } from '@features/trade/services/swap-form-query/swap-form-query.service';
import { CrossChainService } from '@features/trade/services/cross-chain/cross-chain.service';
import { OnChainService } from '@features/trade/services/on-chain/on-chain.service';
import { CrossChainApiService } from '@features/trade/services/cross-chain-routing-api/cross-chain-api.service';
import { SettingsService } from '@features/swaps/core/services/settings-service/settings.service';
import { TargetNetworkAddressService } from '@features/swaps/core/services/target-network-address-service/target-network-address.service';
import { TuiButtonModule, TuiExpandModule, TuiScrollbarModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PreviewSwapComponent } from './components/preview-swap/preview-swap.component';
import { SwapsModule } from '@features/swaps/swaps.module';
import { AssetsSelectorModule } from '@features/swaps/shared/components/assets-selector/assets-selector.module';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { ReceiverAddressButtonComponent } from './components/receiver-address-button/receiver-address-button.component';
import { SwapDataElementComponent } from './components/swap-data-element/swap-data-element.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    TradePageComponent,
    ProvidersListComponent,
    ProviderElementComponent,
    PreviewSwapComponent,
    ActionButtonComponent,
    ReceiverAddressButtonComponent,
    SwapDataElementComponent,
    TransactionDetailsComponent
  ],
  exports: [],
  imports: [
    TradeRoutingModule,
    CommonModule,
    SharedModule,
    TuiExpandModule,
    TuiScrollbarModule,
    TuiTagModule,
    InlineSVGModule,
    SwapsModule,
    AssetsSelectorModule,
    TuiButtonModule,
    ClipboardModule
    // SwapsRoutingModule,
    // SwapsSharedModule,
    // InstantTradeModule,
    // CrossChainModule,
    // OnramperExchangerModule,
    // LimitOrderModule,
    // TuiHostedDropdownModule,
    // TuiDataListModule,
    // TuiSvgModule,
    // TuiDropdownModule,
    // ReactiveFormsModule,
    // TuiInputModule,
    // TuiSliderModule,
    // TuiToggleModule,
    // TuiInputNumberModule,
    // TuiTextfieldControllerModule,
    // InlineSVGModule,
    // TuiHintModule,
    // AssetsSelectorModule,
    // FormsModule,
    // TuiLoaderModule,
    // ClipboardModule,
    // TuiAccordionModule,
    // TuiHintModule
  ],
  providers: [
    SwapsStateService,
    SwapsFormService,
    SwapsControllerService,
    SwapFormQueryService,
    CrossChainService,
    OnChainService,
    CrossChainApiService,
    SettingsService,
    TargetNetworkAddressService
    // SettingsService,
    // RefreshService,
    // TradeService,
    // TargetNetworkAddressService,
    // TonPromoService
  ]
})
export class TradeModule {}
