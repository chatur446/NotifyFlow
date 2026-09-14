const { connect } = require("nats");

let natsConnection = null;

const connectToNats = async () => {
  if (natsConnection) {
    return natsConnection;
  }

  const natsUrl = process.env.NATS_URL || "nats://localhost:4222";

  natsConnection = await connect({
    servers: natsUrl,
    name: "notification-service",
    maxReconnectAttempts: -1,
    reconnectTimeWait: 2000,
  });

  console.log("Connected to NATS");

  return natsConnection;
};

const getNatsConnection = () => {
  if (!natsConnection) {
    throw new Error("NATS connection has not been established");
  }

  return natsConnection;
};

const closeNatsConnection = async () => {
  if (natsConnection) {
    await natsConnection.drain();
    natsConnection = null;
    console.log("NATS connection closed");
  }
};

module.exports = {
  connectToNats,
  getNatsConnection,
  closeNatsConnection,
};