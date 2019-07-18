const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://DCI:DCI12345@cluster0-wwdfz.mongodb.net/DB?retryWrites=true&w=majority',
{ useNewUrlParser: true});

module.exports = mongoose;