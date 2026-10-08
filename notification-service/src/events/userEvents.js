const { StringCodec, AckPolicy, DeliverPolicy } = require("nats");
const { getNatsConnection } = require("../config/nats");
const { STREAM_NAME } = require("../config/jetstream");
const { processUserRegistered } = require("../services/notificationService");

const stringCodec = StringCodec();

const subscribeToUserRegistered = async () => {
  const nc = getNatsConnection();
  const js = nc.jetstream();

  const jsm = await nc.jetstreamManager();

  const consumerName = "notification-service";

  try {
    await jsm.consumers.info(STREAM_NAME, consumerName);
    console.log(`JetStream consumer ${consumerName} already exists`);
  } catch (error) {
    await jsm.consumers.add(STREAM_NAME, {
      durable_name: consumerName,
      ack_policy: AckPolicy.Explicit,
      deliver_policy: DeliverPolicy.All,
    });

    console.log(`JetStream consumer ${consumerName} created`);
  }

  const consumer = await js.consumers.get(STREAM_NAME, consumerName);
  const messages = await consumer.consume();

  console.log("Listening for user.registered events through JetStream...");

  for await (const message of messages) {
    try {
      const event = JSON.parse(stringCodec.decode(message.data));

      console.log("Received user.registered event:");

      const notification = await processUserRegistered(event);

      message.ack();

      console.log("Notification completed:", notification.type);
      console.log("Message acknowledged");
    } catch (error) {
      console.error("Failed to process user.registered event:", error);
    }
  }
};

module.exports = {
  subscribeToUserRegistered
};