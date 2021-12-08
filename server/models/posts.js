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

const postSchema = new mongoose.Schema({
  id: Number,
  user: String,
  timestamp: String,
  content: String,
  likes: Array,
  tags: Array,
  board: String,
});

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
