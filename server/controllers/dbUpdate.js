require("dotenv").config()

const User = require("../models/users");

async function run() {
  await User.updateMany(
    { displayName: id },
  );
}

run();
