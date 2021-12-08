const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

console.log("connecting to ", url);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });

const userSchema = new mongoose.Schema({
  id: String,
  password: String,
  avatar: String,
  follows: Array,
  bio: String,
  displayName: String,
  gender: String,
  subscriptions: Array,
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
