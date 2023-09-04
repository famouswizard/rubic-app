import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Asset } from '@features/swaps/shared/models/form/asset';
import { AvailableTokenAmount } from '@shared/models/tokens/available-token-amount';
import { FiatAsset } from '@shared/models/fiats/fiat-asset';
import { BLOCKCHAINS } from '@shared/constants/blockchain/ui-blockchains';

interface AssetSelector {
  readonly mainImage: string | null;
  readonly secondImage: string | null;
  readonly mainLabel: string | null;
  readonly secondLabel: string | null;
}

@Component({
  selector: 'app-asset-selector',
  templateUrl: './asset-selector.component.html',
  styleUrls: ['./asset-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetSelectorComponent {
  public visibleAsset: AssetSelector | null = null;

  @Output() public handleAssetSelection = new EventEmitter<void>();

  @Input() set asset(value: Asset | null) {
    if (value) {
      this.visibleAsset = 'amount' in value ? this.getTokenAsset(value) : this.getFiatAsset(value);
    } else {
      this.visibleAsset = null;
    }
  }

  private getTokenAsset(token: AvailableTokenAmount): AssetSelector {
    const blockchain = BLOCKCHAINS[token.blockchain];

    return {
      secondImage: blockchain.img,
      secondLabel: blockchain.name,
      mainImage: token.image,
      mainLabel: token.symbol
    };
  }

  private getFiatAsset(fiat: FiatAsset): AssetSelector {
    // @TODO NEW DESIGN
    return {
      secondImage: '',
      secondLabel: 'Fiat currency',
      mainImage: fiat.image,
      mainLabel: fiat.name
    };
  }
}