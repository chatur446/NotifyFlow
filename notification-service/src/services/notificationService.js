const processUserRegistered = async (event) => {
  const { userId, name, email } = event.data;

  const notification = {
    type: "WELCOME_NOTIFICATION",
    userId,
    recipient: email,
    message: `Welcome ${name}! Your account has been successfully created.`,
    createdAt: new Date().toISOString()
  };

  console.log("Notification processed:");
  console.log(JSON.stringify(notification, null, 2));

  return notification;
};

module.exports = {
  processUserRegistered
};