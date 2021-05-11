const mongoose = require('mongoose');

const { Schema } = mongoose;

const jobSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    default: Date.now
  },
  status: {
    type: String,
    default: 'Live'
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
