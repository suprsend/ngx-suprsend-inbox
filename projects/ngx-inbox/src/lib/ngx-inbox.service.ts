import { Injectable, Inject } from '@angular/core';
import SuprSendInbox, { IRemoteNotification } from '@suprsend/js-inbox';
import { BehaviorSubject } from 'rxjs';

export interface INotificationDataStore {
  notifications: IRemoteNotification[];
  unseenCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class SuprSendInboxService {
  public ssInboxInstance: SuprSendInbox;
  private _notificationData: INotificationDataStore;
  private notificationSubject: BehaviorSubject<INotificationDataStore>;

  constructor(
    @Inject('config') config: { workspaceKey: string; workspaceSecret: string }
  ) {
    this.ssInboxInstance = new SuprSendInbox(
      config.workspaceKey,
      config.workspaceSecret
    );
    this.notificationData = this.ssInboxInstance.feed;
    this.notificationSubject = new BehaviorSubject(this.actualNotificationData);

    this.ssInboxInstance.emitter.on('notificationSynced', () => {
      const updatedFeed = this.ssInboxInstance.feed;
      this.notificationData = updatedFeed;
      this.notificationSubject.next(this.actualNotificationData);
    });
  }

  get notificationData() {
    return this.notificationSubject.asObservable();
  }

  get actualNotificationData() {
    return {
      notifications: this._notificationData.notifications,
      unseenCount: this._notificationData.unseenCount,
    };
  }

  set notificationData(feed: any) {
    this._notificationData = {
      notifications: feed.notifications,
      unseenCount: feed.unseenCount,
    };
  }

  get suprsendEmitter() {
    return this.ssInboxInstance.emitter;
  }

  identifyUser(distinctId?: string, subscriberId?: string) {
    if (subscriberId != this.ssInboxInstance.subscriberId) {
      this.ssInboxInstance.resetUser();
      this.ssInboxInstance.identifyUser(distinctId, subscriberId);
      if (distinctId && subscriberId) {
        this.ssInboxInstance.feed.startNotificationPolling();
      }
    }
  }

  resetUser() {
    this.ssInboxInstance.resetUser();
    this.ssInboxInstance.identifyUser('', '');
  }

  markAllSeen() {
    this.ssInboxInstance.feed.markAllSeen();
  }

  async markClicked(id: string) {
    await this.ssInboxInstance.feed.markClicked(id);
  }
}
