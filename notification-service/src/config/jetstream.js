const { getNatsConnection } = require("./nats");

const STREAM_NAME = "USER_EVENTS";
const STREAM_SUBJECTS = ["user.registered"];

const ensureUserEventsStream = async () => {
  const nc = getNatsConnection();
  const jsm = await nc.jetstreamManager();

  try {
    await jsm.streams.info(STREAM_NAME);
    console.log(`JetStream stream ${STREAM_NAME} already exists`);
  } catch (error) {
    await jsm.streams.add({
      name: STREAM_NAME,
      subjects: STREAM_SUBJECTS,
      retention: "limits",
      storage: "file",
      max_msgs: -1,
      max_bytes: -1,
      max_age: 0,
    });

    console.log(`JetStream stream ${STREAM_NAME} created`);
  }
};

module.exports = {
  STREAM_NAME,
  STREAM_SUBJECTS,
  ensureUserEventsStream,
};