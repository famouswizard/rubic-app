import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FiatAsset } from '@features/swaps/shared/models/fiats/fiat-asset';
import { FiatsService } from '@core/services/fiats/fiats.service';

@Injectable()
export class FiatsListService {
  private readonly _fiatsToShow$ = new BehaviorSubject<FiatAsset[]>(this.fiatsService.fiats);

  public readonly fiatsToShow$ = this._fiatsToShow$.asObservable();

  // todo add search query
  private set fiatsToShow(value: FiatAsset[]) {
    this._fiatsToShow$.next(value);
  }

  constructor(private readonly fiatsService: FiatsService) {}
}
