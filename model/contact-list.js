const connection = require('./connection');

const ContactSchema = new mongoose.Schema({
    ID:{
        type:String,
        required: true,
    },    
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

const ContactList= connection.model('ContactList', ContactSchema);

module.exports= ContactList;