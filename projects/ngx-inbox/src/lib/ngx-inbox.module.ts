import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { SuprSendInboxComponent } from './ngx-inbox.component';
import { SuprSendInboxService } from './ngx-inbox.service';
import {
  IRemoteNotification,
  IRemoteNotificationMessage,
} from '@suprsend/js-inbox';
import { TimeAgoPipe } from './timeago.pipe';
import { NoContentDirective } from './nocontent.directive';

@NgModule({
  declarations: [SuprSendInboxComponent, NoContentDirective, TimeAgoPipe],
  imports: [CommonModule],
  exports: [SuprSendInboxComponent],
})
export class SuprSendInboxModule {
  static forRoot(config: {
    workspaceKey: string;
    workspaceSecret: string;
  }): ModuleWithProviders<SuprSendInboxModule> {
    return {
      ngModule: SuprSendInboxModule,
      providers: [
        SuprSendInboxService,
        { provide: 'config', useValue: config },
      ],
    };
  }
}

export { IRemoteNotification, IRemoteNotificationMessage };
