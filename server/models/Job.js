const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat');
// const dateFormat = require('../utils/');


const { Schema } = mongoose;
// const User = require('./User');
const Comment = require('./Comment');
const WalkerJob = require('./Comment');

const jobSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title:{
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0.99
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
    get: createdAtVal => dateFormat(createdAtVal)

  },
  status: {
    type: String,
    default: 'Live',
    required: true
  },
  appliedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  selectedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ,
  comments: [Comment.schema]
},
{
    toJSON:{
        getters: true
    }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
