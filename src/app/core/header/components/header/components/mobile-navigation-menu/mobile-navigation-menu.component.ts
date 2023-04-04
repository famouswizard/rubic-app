import { Component } from '@angular/core';
import { MobileNativeModalService } from '@app/core/modals/services/mobile-native-modal.service';
import { MOBILE_NAVIGATION_LIST } from '../rubic-menu/models/navigation-list';

@Component({
  selector: 'app-mobile-navigation-menu',
  templateUrl: './mobile-navigation-menu.component.html',
  styleUrls: ['./mobile-navigation-menu.component.scss']
})
export class MobileNavigationMenuComponent {
  public readonly mobileNavigationList = MOBILE_NAVIGATION_LIST.Trade.filter(
    listItem => listItem.translateKey !== 'ChangeNow Tx'
  );

  public currentURL = '';

  constructor(private readonly mobileNativeService: MobileNativeModalService) {}

  public mobileClose(): void {
    this.mobileNativeService.forceClose();
  }
}
