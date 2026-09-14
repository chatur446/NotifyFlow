const { StringCodec } = require("nats");
const { getNatsConnection } = require("../config/nats");

const stringCodec = StringCodec();

const subscribeToUserRegistered = async () => {
  const nc = getNatsConnection();

  const subscription = nc.subscribe("user.registered");

  console.log("Listening for user.registered events...");

  for await (const message of subscription) {
    try {
      const event = JSON.parse(stringCodec.decode(message.data));

      console.log("Received user.registered event:");
      console.log(JSON.stringify(event, null, 2));
    } catch (error) {
      console.error("Failed to process user.registered event:", error);
    }
  }
};

module.exports = {
  subscribeToUserRegistered,
};