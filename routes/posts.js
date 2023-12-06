const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imageText: { 
    type: String, 
    required: true 
},
image:{
  type:String
},
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  likes: {
     type: Array, 
     default: [], 
    },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);

