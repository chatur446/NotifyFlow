const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const express = require("express");

const { testDatabaseConnection } = require("./config/database");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = process.env.USER_SERVICE_PORT || 3001;

const { connectToNats } = require("./config/nats");

const startServer = async () => {
  try {
    await testDatabaseConnection();
    await connectToNats();

    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start User Service:", error);
    process.exit(1);
  }
};

startServer();