# @suprsend/ngx-inbox

This package has been deprecated. Please use [@suprsend/web-components](https://docs.suprsend.com/docs/web-components-integration)

## Installation

**NOTE**: Currently suprsend angular sdk suports angular version >=12.0.0

Angular Inbox depends on **js-inbox** which provides core logic like fetching notifications and modifying notifications. **popperjs/core** package provides a tooltip for showing inbox notifications.

```shell npm
npm install @suprsend/ngx-inbox @suprsend/js-inbox@1.0.0 @popperjs/core
```

```shell yarn
yarn add @suprsend/ngx-inbox @suprsend/js-inbox @popperjs/core
```

<br>

## Integrating Inbox

1. Import **SuprSendInboxModule** in _app.module.ts_ and add inside **NgModule**.

```typescript app.module.ts
import { SuprSendInboxModule } from "@suprsend/ngx-inbox";

@NgModule({
  // ...
  imports: [
    // ...
    SuprSendInboxModule.forRoot({
      workspaceKey: "your workspaceKey",
      workspaceSecret: "your workspaceSecret",
    }),
  ],
  // ...
})
export class AppModule {}
```

2. Add a Component in the template where you want to show the inbox on UI.

```html your-component.component.ts
<suprsend-inbox></suprsend-inbox>
```

3. Add SuprSend inbox styles in the global styles file.

```css styles.css
@import url("@suprsend/ngx-inbox/assets/styles.css");
```

4. Identify the user by passing `distinct_id` and `subscriber_id`. Refer [HMAC authentication](https://github.com/suprsend/ngx-suprsend-inbox/blob/main/docs/authentication.md) section to understand how to generate subscriber_id

```typescript your-component.component.ts
import { SuprSendInboxService } from "@suprsend/ngx-inbox";

export class MyComponent implements OnInit {
  constructor(private ssinbox: SuprSendInboxService) {}

  async ngOnInit() {
    this.ssinbox.identifyUser("distinct_id", "subscriber_id");
  }
}
```

<br>

| Field           | Description                                                                                                                                                                                                                                                                       | Format                    |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------ |
| workspaceKey    | WORKSPACE KEY available on Suprsend dashboard left navigation panel                                                                                                                                                                                                               | string                    |
| workspaceSecret | WORKSPACE SECRET available on Suprsend dashboard left navigation panel                                                                                                                                                                                                            | string                    |
| subscriberId    | Unique string used to prevent Man-in-the-browser attacks with predictable `distinct_id`. \n \nYou can generate `subscriber_id` in your server-side code by following [HMAC authentication](https://github.com/suprsend/ngx-suprsend-inbox/blob/main/docs/authentication.md) steps | string                    |
| distinctId      | unique identifier for your subscriber or user                                                                                                                                                                                                                                     | int, bigint, string, UUID |

<br>

## Integrating Toast

SuprSend Inbox also supports showing toast notifications if a user is active in your application and receives any inbox notification. We internally use [ngx-toastr](https://github.com/scttcper/ngx-toastr). If you want toast notifications as well you have to integrate [ngx-toastr](https://github.com/scttcper/ngx-toastr) in your application and pass toaster directive selector, with toastr service as a param value. Skip this step if you don't want to show toast on receiving new notifications.

```html your-component.component.html
<suprsend-inbox [toaster]="your toastr-service instance"></suprsend-inbox>
```

Also, add toastr styles in your global styles file like given in ngx-toastr documentation above suprsend styles importing as we are overriding default toastr styles internally in SDK

```css styles.css
@import url("ngx-toastr/toastr"); /* or others provided in ngx-toastr docs */
@import url("@suprsend/ngx-inbox/assets/styles.css");
```

###

The inbox component is highly customizable. For most parts in Inbox, we also support custom components using render props. This is how the default inbox looks like with its components marked in order.

<br>

![](https://files.readme.io/179bd7a-Inbox_view_1.png)

<br>

## Customizing Bell icon

The Bell icon is an SVG image. You can create a custom bell using the code below. Pass **ssBell** in your bell element.

```javascript
<suprsend-inbox>

  <!-- your custom design -->
  <p ssBell>Hello</p>


</suprsend-inbox>
```

<br>

You can also customize the color, height and width of the existing bell icon image. Here's an example code for customizing the bell icon. You can customize CSS of the specific element by overriding existing styles on the class like below code snippet.

```css styles.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.ss-bell {
  color: red;
  height: 24px;
  width: 24px;
}
```

| Property name | Customization method        |
| :------------ | :-------------------------- |
| bell color    | `.ss-bell { color: red; }`  |
| bell height   | `.ss-bell { height: 24px;}` |
| bell width    | `.ss-bell { width: 24px; }` |

<br>

## Customizing Badge (counter)

This element shows the number of unseen notifications for the current user. You use your custom badge component like below

Here's an example code for customizing the badge content

```html your-component.component.ts
<suprsend-inbox>
  <ng-template #ssBadge let-count>
    <!-- your custom design -->
    <p style="color: red; margin: 0px">{{ count }}</p>
    <!-- your custom design -->
  </ng-template>
</suprsend-inbox>
```

or you can customize CSS of the specific element to change the background color, text color, and text margin of the existing badge.

Here's an example code for customizing the badge theme.

```css styles.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.ss-badge {
  font-size: 10px;
  display: inline-block;
  position: absolute;
  right: -3px;
  top: -7px;
  padding: 3px 6px;
  background-color: red;
  color: white;
  text-align: center;
  border-radius: 50%;
}
```

| Property name    | Customization method                        |
| :--------------- | ------------------------------------------- |
| background color | `.ss-badge { background-color: blue; }`     |
| text color       | `.ss-badge { color: black; }`               |
| text margin      | `.ss-badge { right: -3px;     top: -7px; }` |
| font family      | `.ss-badge { font-family: 'Roboto' } `      |
| font size        | `.ss-badge { font-size: 15px; }`            |
| font weight      | `.ss-badge { font-weight: 500; }`           |
| padding          | `.ss-badge { padding: 4px 8px; }`           |
| text align       | `.ss-badge { text-align: right; }`          |
| border radius    | `.ss-badge { border-radius: 80%; }`         |

<br>

## Customizing Header

This is the heading of the Notifications Inbox. You can customize the background color, text color, and text size among other properties

Here's an example code for customizing the heading

```javascript style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.ss-notification-header-text {
  font-size: 16px;
  margin: 10px 0px;
  white-space: pre-line;
}
```

| Property name  | Customization method                                      |
| :------------- | --------------------------------------------------------- |
| text color     | `.ss-notification-header-text {     color: blue; }`       |
| text margin    | `.ss-notification-header-text {     margin: 10px 0px; }`  |
| text alignment | `.ss-notification-header-text { text-align: right; }`     |
| font family    | `.ss-notification-header-text { font-family: 'Roboto'; }` |
| font size      | `.ss-notification-header-text { font-size: 16px; }`       |
| font weight    | `.ss-notification-header-text { font-weight: 500; }`      |

<br>

## Customizing Notification Card

The style of notification depends on its state. It can be read or unread. Read state is the default state. The unread state just has an additional unseen dot on the card. You can customize the existing theme of the container, body text, header text, and unread dot. These are all the components of a notification card

![](https://files.readme.io/e7431a7-notification_card_1.png)

Here's an example code for customizing the notification container

```css style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.ss-notification-container {
  padding: 7px 14px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}
```

<br>

### Background (container)

| Property name    | Customization method                                               |
| :--------------- | ------------------------------------------------------------------ |
| background color | `.ss-notification-container { background-color: #fff; }`           |
| bottom border    | `.ss-notification-container { border-bottom: 1px solid #f0f0f0; }` |
| cursor style     | `.ss-notification-container { cursor: pointer; }`                  |
| padding          | `.ss-notification-container {  padding: 10px 12px; }`              |

<br>

### Header text

Here's an example code for customizing the heading

```css style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.ss-notification-header-text {
  font-size: 16px;
  margin: 10px 0px;
  white-space: pre-line;
}
```

| Property name  | Customization method                                      |
| :------------- | --------------------------------------------------------- |
| text color     | `.ss-notification-header-text {     color: blue; }`       |
| text margin    | `.ss-notification-header-text {     margin: 10px 0px; }`  |
| text alignment | `.ss-notification-header-text { text-align: right; }`     |
| font family    | `.ss-notification-header-text { font-family: 'Roboto'; }` |
| font size      | `.ss-notification-header-text { font-size: 16px; }`       |
| font weight    | `.ss-notification-header-text { font-weight: 500; }`      |

<br>

### Body text

Here's an example code for customizing the body text

```css style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.ss-notification-body-text {
  margin: 10px 0px;
  white-space: pre-line;
}
```

| Property name  | Customization method                                    |
| :------------- | ------------------------------------------------------- |
| text color     | `.ss-notification-body-text {     color: blue; }`       |
| text margin    | `.ss-notification-body-text {     margin: 10px 0px; }`  |
| text alignment | `.ss-notification-body-text { text-align: right; }`     |
| font family    | `.ss-notification-body-text { font-family: 'Roboto'; }` |
| font size      | `.ss-notification-body-text { font-size: 16px; }`       |
| font weight    | `.ss-notification-body-text { font-weight: 500; }`      |

<br>

### Unread dot

Here's an example code for customizing the unread dot

```css style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.ss-notification-unseendot {
  background: #358adf;
  border-radius: 50%;
  width: 7px;
  height: 7px;
  margin-top: 18px;
}
```

| Property name                        | Customization method                                              |
| :----------------------------------- | ----------------------------------------------------------------- |
| background color                     | `.ss-notification-unseendot {     background: #358adf; }`         |
| background border radius             | `.ss-notification-unseendot { border-radius: 80%;     }`          |
| dot size                             | `.ss-notification-unseendot { width: 9px;     height: 9px;     }` |
| margin from top of notification card | `.ss-notification-unseendot { margin-top: 18px; }`                |

<br>

### Buttons

There are two types of buttons on a notification card - Primary (solid background) and Secondary button (outlined button)

![](https://files.readme.io/efc3b82-buttons.png)

### Primary Button

Here's an example code for customizing the primary button

```css style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.ss-action-primary {
  width: 150px;
  background: #358adf;
  border-radius: 5px;
  text-decoration: none;
}

.ss-action-primary-text {
  color: white;
  padding: 5px 0px;
  text-align: center;
  word-break: break-all;
}
```

**Primary button background**

| Property name            | Customization method                                  |
| :----------------------- | ----------------------------------------------------- |
| background color         | `.ss-action-primary {     background: #df357c; }`     |
| background border radius | `.ss-action-primary {     border-radius: 8px; }`      |
| button width             | `.ss-action-primary {     width: 150px; }`            |
| button text decoration   | `.ss-action-primary {     text-decoration: dashed; }` |

<br>

**Primary button text**

| Property name                                       | Customization method                                 |
| :-------------------------------------------------- | ---------------------------------------------------- |
| text color                                          | `.ss-action-primary-text {     color: #c9c7c7; }`    |
| text padding                                        | `.ss-action-primary-text {     padding: 10px 0px; }` |
| text alignment                                      | `.ss-action-primary-text { text-align: right; }`     |
| font family                                         | `.ss-action-primary-text { font-family: 'Roboto'; }` |
| font size                                           | `.ss-action-primary-text { font-size: 16px; }`       |
| font weight                                         | `.ss-action-primary-text { font-weight: 500; }`      |
| word-break (if the text overflows the button wdith) | `.ss-action-primary-text { word-break: normal; }`    |

<br>

### Secondary Button

Here's an example code for customizing the secondary button

```css style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.ss-action-outline {
  width: 150px;
  background: #358adf;
  border-radius: 5px;
  text-decoration: none;
  border-color: #358adf;
  border-style: solid;
  border-width: 1px;
}

.ss-action-outline-text {
  color: #358adf;
  padding: 5px 0px;
  text-align: center;
  word-break: break-all;
}
```

**Secondary button background**

| Property name            | Customization method                                  |
| :----------------------- | ----------------------------------------------------- |
| background color         | `.ss-action-outline {     background: #358adf; }`     |
| background border radius | `.ss-action-outline {     border-radius: 8px; }`      |
| button width             | `.ss-action-outline {     width: 150px; }`            |
| button text decoration   | `.ss-action-outline {     text-decoration: dashed; }` |
| border color             | `.ss-action-outline {     border-color: #c9c7c7; }`   |
| border style             | `.ss-action-outline {     border-style: dashed; }`    |
| border width             | `.ss-action-outline {     border-width: 2px; }`       |

<br>

**Secondary button text**

| Property name                                       | Customization method                                 |
| :-------------------------------------------------- | ---------------------------------------------------- |
| text color                                          | `.ss-action-outline-text {     color: #c9c7c7; }`    |
| text padding                                        | `.ss-action-outline-text {     padding: 10px 0px; }` |
| text alignment                                      | `.ss-action-outline-text { text-align: right; }`     |
| font family                                         | `.ss-action-outline-text { font-family: 'Roboto'; }` |
| font size                                           | `.ss-action-outline-text { font-size: 16px; }`       |
| font weight                                         | `.ss-action-outline-text { font-weight: 500; }`      |
| word-break (if the text overflows the button wdith) | `.ss-action-outline-text { word-break: normal; }`    |

<br>

## Design custom notification card component

You can either customize the CSS properties of default notification card as mentioned above or create your own notification card. You can override the data that you want to show on the card as well as the look and feel of the card

```html your-component.component.ts
<suprsend-inbox>
  <ng-template #ssNotification let-notification>
    <!-- your custom design -->
    <div>
      <p>{{ notification.message.header }}</p>
      <p>{{ notification.message.text }}</p>
    </div>
    <!-- your custom code -->
  </ng-template>
</suprsend-inbox>
```

<br>

## Set a custom click handler

On click of the notification card, SDK will internally mark it as seen and redirects to the action URL you provided in the template. You can also override redirection and provide a custom function as **notificationClickHandler** which will be called after marking seen. In the custom handler, notification payload data will be passed as a parameter.

```html your-component.component.html
<suprsend-inbox [notificationClickHandler]="customFunction"></suprsend-inbox>
```

```typescript your-component.component.ts
import { SuprSendInboxService, IRemoteNotification } from "@suprsend/ngx-inbox";

// ...
export class MyComponent {
  constructor(private ssinbox: SuprSendInboxService) {}

  customFunction(notifications: IRemoteNotification) {
    console.log("called notification", notifications);
  }
}
```

<br>

## Customizing Toast

A toast appears when a new inbox notification is received when the user is active on the platform. By default, the toast message is shown on the new message arrival showing the header and body text of the notification. You can customize the content shown on the toast and its styling or hide the toast altogether as per your requirement. These is the default toast with its components marked

![](https://files.readme.io/097f606-toast.png)

### Styling toast theme

You can style the background color and text of the notification toast

#### background

Here's an example code for customizing the toast background

```css style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.toast-success {
  background-color: white;
  background-image: none;
}

.toast-container .ngx-toastr {
  padding-left: 15px;
  max-width: 450px;
  min-width: 300px;
  width: auto;
}
```

| Property name                                    | Customization method                                                                                                    |
| :----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| background color                                 | `.toast-success {     background-color: #808080; }`                                                                     |
| if you want to add background image in the toast | `.toast-success {     background-image: none; }`                                                                        |
| toast width                                      | `.toast-container .ngx-toastr {     padding-left: 15px;     max-width: 450px;     min-width: 300px;     width: auto; }` |

<br>

#### header text

Here's an example code for customizing the toast header text

```css style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.toast-title {
  font-size: 16px;
  font-weight: 400;
  margin: 0px;
  color: #000;
  margin-top: 0px;
  margin-bottom: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

@media (max-width: 425px) {
  .toast-title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: 0px;
  }
}
```

| Property name  | Customization method                                                                                               |
| :------------- | ------------------------------------------------------------------------------------------------------------------ |
| text color     | `.toast-title {     color: #c9c7c7; }`                                                                             |
| text margin    | `.toast-title {     margin: 0px;       margin-top: 0px;     margin-bottom: 10px; }`                                |
| font family    | `.toast-title {     font-family:  Roboto; }`                                                                       |
| font size      | `.toast-title { font-size: 18px; }`                                                                                |
| font weight    | `.toast-title { font-weight: 500; }`                                                                               |
| title overflow | `@media (max-width: 425px) {     .toast-title {       text-overflow: ellipsis;       overflow: hidden;      }   }` |

<br>

#### body text

Here's an example code for customizing the toast header text

```css style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.toast-message {
  font-size: 14px;
  font-weight: 400;
  margin: 0px;
  color: #000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  word-wrap: break-word;
  margin-top: 0px;
}

@media (max-width: 425px) {
  .toast-message {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: 0px;
  }
}
```

t

| Property name  | Customization method                                                                                                 |
| :------------- | -------------------------------------------------------------------------------------------------------------------- |
| text color     | `.toast-message {     color: #c9c7c7; }`                                                                             |
| text margin    | `.toast-message {     margin: 0px;       margin-top: 0px;     margin-bottom: 10px; }`                                |
| font family    | `.toast-message {     font-family:  Roboto; }`                                                                       |
| font size      | `.toast-message { font-size: 18px; }`                                                                                |
| font weight    | `.toast-message { font-weight: 500; }`                                                                               |
| title overflow | `@media (max-width: 425px) {     .toast-message {       text-overflow: ellipsis;       overflow: hidden;      }   }` |

<br>

## Customizing Empty Inbox screen

The notification inbox shows a text when the user has no notifications. You can change the content and styling of the blank screen.

### Changing Empty screen content

The default empty screen looks like this

![](https://files.readme.io/beb9489-Screenshot_2023-03-02_at_1.13.08_AM.png)

Here's an example code for customizing the toast header text

```css style.css
@import url("@suprsend/ngx-inbox/assets/styles.css");

.ss-no-notifications-text {
  text-align: center;
  font-style: italic;
  margin: 20px 0px;
  background-color: transparent;
  color: #707070;
}
```

<br>

| Property name    | Customization method                                           |
| :--------------- | -------------------------------------------------------------- |
| background color | `.ss-no-notifications-text { background-color: transparent; }` |
| text color       | `.ss-no-notifications-text { color: #7393B3; }`                |
| text margin      | `.ss-no-notifications-text { margin: 25px 5px; }`              |
| text alignment   | `.ss-no-notifications-text { text-align: right; }`             |
| font family      | `.ss-no-notifications-text { font-family: Roboto; }`           |
| font size        | `.ss-no-notifications-text { font-size: 18px; }`               |
| font weight      | `.ss-no-notifications-text { font-weight: 500; }`              |
| font style       | `.ss-no-notifications-text { font-style: normal; }`            |

<br>

## Customizing styles using HTML template file

Below is list of classnames of html elements. you can also refer sdks internal [CSS file](https://github.com/suprsend/ngx-suprsend-inbox/blob/main/projects/ngx-inbox/assets/styles.css) and [HTML template file](https://github.com/suprsend/ngx-suprsend-inbox/blob/main/projects/ngx-inbox/src/lib/ngx-inbox.component.html)

| ClassName                    | Usage                                                                                   |
| :--------------------------- | :-------------------------------------------------------------------------------------- |
| ss-badge                     | override the alert that shows on the bell icon when there are unseen notifications      |
| ss-bell                      | bell icon style can be overridden using this class                                      |
| ss-no-notifications-text     | the class name of empty state text when no notifications are present                    |
| ss-notification-header-text  | Notification card's header class name                                                   |
| ss-notification-body-text    | Notification card's body text class name                                                |
| ss-notification-unseendot    | Notification cards unread dot class name, this appears when notification is not clicked |
| ss-action-primary            | Primary action button's div class name                                                  |
| ss-action-primary-text       | Primary action button's text class name                                                 |
| ss-action-outline            | Secondary action button's div class name                                                |
| ss-action-outline-text       | Primary action button's text class name                                                 |
| ss-notification-created-text | Notification created on text class name                                                 |
