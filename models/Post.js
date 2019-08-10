var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    msg : String ,
    author : { type : mongoose.Schema.Types.ObjectId , ref : 'User' }

});


module.exports = mongoose.model('Post', postSchema);