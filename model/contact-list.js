const connection = require('./connection');

const ContactSchema = new connection.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    avatar:{
        type:String,
    },
    userID:{
        type:String,
    }
});

const ContactList= connection.model('contactlists', ContactSchema);

module.exports= ContactList;