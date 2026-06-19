import { messaging } from 'firebase-admin';
import { DataMessagePayload, Notification, TopicMessage } from 'firebase-admin/messaging';

async function sendPushNotificationToTopic(
  options: {
    topic: string,
    title: string;
    body: string;
    payloadData: Record<string, any>;
    sound?: string;
    platform?: 'ios' | 'android'
  }
) {

  console.log("-----SENDING TO TOPIC-----", options.topic, options.title, options.body, options.payloadData, options.platform);

  const message: TopicMessage = {
    topic: options.topic,
  };

  if (!options.platform) {
    message["notification"] = {
      title: options.title,
      body: options.body,
    };
    message["data"] = {
      payload: JSON.stringify(options.payloadData),
      sound: options.sound ?? "default",
    };
  }

  if (options.platform === 'android') {
    const notificationData: Notification = {
      "title": options.title,
      "body": options.body,
    }

    message['notification'] = notificationData;
    message['android'] = {
      'data': {
        'click_action': 'FLUTTER_NOTIFICATION_CLICK',
        'payload': JSON.stringify(options.payloadData),
        'sound': options.sound ?? "default",
      }
    }
  }

  if (options.platform === 'ios') {
    const messageData: DataMessagePayload = {
      'title': options.title,
      'body': options.body,
      'badge': "1",
      'payload': JSON.stringify(options.payloadData),
      'click_action': "FLUTTER_NOTIFICATION_CLICK",
      'sound': options.sound ?? "default",
    };
    
    message['data'] = {
      ...messageData,
    };
  }

  try {
    const sentResult = await messaging().send(message);
    console.log("-----------MESSAGE SENT-----------: NOTIFUCATION ID: ", sentResult);
  } catch (error) {
    console.log("***********MESSAGE SENT ERROR***********");
    console.log(error);
  }
}

export { sendPushNotificationToTopic };
