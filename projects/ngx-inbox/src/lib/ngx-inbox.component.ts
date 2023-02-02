import {
  Component,
  TemplateRef,
  ContentChild,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import {
  SuprSendInboxService,
  INotificationDataStore,
} from './ngx-inbox.service';
import {
  IRemoteNotification,
  IActionObject,
  IRemoteNotificationMessage,
} from '@suprsend/js-inbox';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'suprsend-inbox',
  templateUrl: './ngx-inbox.component.html',
  styleUrls: ['./ngx-inbox.component.css'],
})
export class SuprSendInboxComponent implements OnDestroy {
  unseenCount: number;
  notifications: IRemoteNotification[];
  showPopper = false;
  listener;

  @ContentChild('ssNotification') notificationRef: TemplateRef<any>;
  @ContentChild('ssBadge') badgeRef: TemplateRef<any>;
  @ViewChild('ssToggleButton') ssToggleButton: ElementRef;
  @ViewChild('ssPopperMenu') ssPopperMenu: ElementRef;

  // user defined inputs
  @Input() hideToast: boolean = false;
  // @Input() hideInbox: boolean = false;
  @Input() collapseToastNotifications: boolean;
  @Input() toaster;
  @Input() toasterConfig;
  @Input() notificationClickHandler: (
    notification: IRemoteNotification
  ) => void;

  constructor(
    private inboxServiceInstance: SuprSendInboxService,
    private renderer: Renderer2
  ) {
    this.inboxServiceInstance.notificationData.subscribe(
      (data: INotificationDataStore) => {
        this.unseenCount = data.unseenCount;
        this.notifications = data.notifications;
      }
    );

    // toaster logic
    if (!this.hideToast) {
      this.inboxServiceInstance.ssInboxInstance.emitter.on(
        'new_notification',
        (notifications: IRemoteNotification[]) => {
          if (notifications?.length && this.toaster?.success) {
            const newToastConfig = this.modifyToastConfig();
            if (this.collapseToastNotifications && notifications.length > 1) {
              // multiple notifications collapse
              this.toaster.success(
                `You have ${notifications.length} new notifications`,
                '',
                newToastConfig
              );
            } else {
              notifications.forEach((notification: IRemoteNotification) => {
                const message: IRemoteNotificationMessage =
                  notification.message;
                this.toaster.success(
                  message.text,
                  message.header,
                  newToastConfig
                );
              });
            }
          }
        }
      );
    }
  }

  ngOnInit() {
    let popperInstance = null;
    const button = document.querySelector('#ssToggleButton');
    const tooltip = document.querySelector<any>('#ssPopperMenu');

    function create() {
      popperInstance = createPopper(button, tooltip, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
      });
    }

    function destroy() {
      if (popperInstance) {
        popperInstance.destroy();
        popperInstance = null;
      }
    }

    this.listener = this.renderer.listen('window', 'click', (e: Event) => {
      if (
        !this.ssToggleButton.nativeElement.contains(e.target) &&
        !this.ssPopperMenu.nativeElement.contains(e.target)
      ) {
        tooltip.removeAttribute('data-show');
        destroy();
        this.showPopper = false;
      }

      if (this.ssToggleButton.nativeElement.contains(e.target)) {
        if (this.showPopper) {
          tooltip.removeAttribute('data-show');
          destroy();
        } else {
          tooltip.setAttribute('data-show', '');
          create();
        }
        this.showPopper = !this.showPopper;
      }
    });
  }

  modifyToastConfig() {
    const isMobile = window.innerWidth > 425;
    const position = isMobile
      ? 'toast-bottom-right'
      : 'toast-bottom-full-width';
    return { positionClass: position, ...this.toasterConfig };
  }

  markAllSeen() {
    this.inboxServiceInstance.markAllSeen();
  }

  async handleNotificationClick(
    $event: Event,
    notification: IRemoteNotification
  ) {
    $event.stopPropagation();
    await this.inboxServiceInstance.markClicked(notification.n_id);
    if (typeof this.notificationClickHandler === 'function') {
      this.notificationClickHandler(notification);
    } else {
      if (notification?.message?.url) {
        window.location.href = notification.message.url;
      }
    }
  }

  async handleActionClick(
    $event: Event,
    n_id: string,
    actionObj: IActionObject
  ) {
    $event.stopPropagation();
    await this.inboxServiceInstance.markClicked(n_id);
    if (actionObj?.url) {
      window.location.href = actionObj.url;
    }
  }

  ngOnDestroy() {
    if (this.listener) {
      this.listener();
    }
    this.inboxServiceInstance.ssInboxInstance.emitter.off('new_notification');
  }
}
