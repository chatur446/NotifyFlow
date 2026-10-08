const express = require("express");

const notificationRoutes = require("./routes/notificationRoutes");
const { connectToNats } = require("./config/nats");
const { ensureUserEventsStream } = require("./config/jetstream");
const { subscribeToUserRegistered } = require("./events/userEvents");

const app = express();

app.use(express.json());

app.use("/api/notifications", notificationRoutes);

const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3002;

const startServer = async () => {
  try {
    await connectToNats();
    await ensureUserEventsStream();

    subscribeToUserRegistered().catch((error) => {
      console.error("NATS consumer error:", error);
      process.exit(1);
    });

    app.listen(PORT, () => {
      console.log(`Notification Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Notification Service:", error);
    process.exit(1);
  }
};

startServer();