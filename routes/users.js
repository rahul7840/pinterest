const mongoose = require('mongoose');
require('dotenv').config();

const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinestClone2")
const db = mongoose.connection;
db.once('connected', () => {
  console.log('❤️  Connected to database');
});


const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  fullname: { 
    type: String, 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
  }],
  dp: {
    type:String,
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema);





