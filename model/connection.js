const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0-${process.env.CLUSTNAME}.mongodb.net/DB?retryWrites=true&w=majority`,
{ useNewUrlParser: true});

module.exports = mongoose;