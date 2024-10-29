import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-zero-fees',
  templateUrl: './banner-zero-fees.component.html',
  styleUrls: ['./banner-zero-fees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerZeroFeesComponent {
  @Input({ required: true }) href: string;
}
