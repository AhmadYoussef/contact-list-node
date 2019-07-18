const connection = require("./connection");

let usersSchema = new connection.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

let users = connection.model("Users", usersSchema);

module.exports = users;
