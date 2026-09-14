const crypto = require("crypto");
const { StringCodec } = require("nats");
const { getNatsConnection } = require("../config/nats");

const stringCodec = StringCodec();

const publishUserRegistered = async (user) => {
  const nc = getNatsConnection();

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

  nc.publish(
    "user.registered",
    stringCodec.encode(JSON.stringify(event))
  );

  console.log("Published user.registered event:", event.eventId);
};

module.exports = {
  publishUserRegistered,
};