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

const boardSchema = new mongoose.Schema({
  id: String,
  desc: String,
});

boardSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
