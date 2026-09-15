const { StringCodec } = require("nats");
const { getNatsConnection } = require("../config/nats");
const { processUserRegistered } = require("../services/notificationService");

const stringCodec = StringCodec();

const subscribeToUserRegistered = async () => {
  const nc = getNatsConnection();

  const subscription = nc.subscribe("user.registered");

  console.log("Listening for user.registered events...");

  for await (const message of subscription) {
    try {
      const event = JSON.parse(stringCodec.decode(message.data));

      console.log("Received user.registered event:");

      const notification = await processUserRegistered(event);

      console.log("Notification completed:", notification.type);
    } catch (error) {
      console.error("Failed to process user.registered event:", error);
    }
  }
};

module.exports = {
  subscribeToUserRegistered
};