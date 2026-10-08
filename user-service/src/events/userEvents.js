const crypto = require("crypto");
const { StringCodec } = require("nats");
const { getNatsConnection } = require("../config/nats");

const stringCodec = StringCodec();

const publishUserRegistered = async (user) => {
  const nc = getNatsConnection();
  const js = nc.jetstream();

  const event = {
    eventId: crypto.randomUUID(),
    eventType: "user.registered",
    timestamp: new Date().toISOString(),
    data: {
      userId: user.id,
      name: user.name,
      email: user.email,
    },
  };

  const ack = await js.publish(
    "user.registered",
    stringCodec.encode(JSON.stringify(event))
  );

  console.log("Published user.registered event:", event.eventId);
  console.log("JetStream sequence:", ack.seq);
};

module.exports = {
  publishUserRegistered,
};