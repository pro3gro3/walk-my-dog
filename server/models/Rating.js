const mongoose = require('mongoose');

const { Schema } = mongoose;

const jobSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walker_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratingNb: {
    type: Number
  },
  text: {
    type: String,
    required: false
  }
  
});

const Rating = mongoose.model('Rating', jobSchema);

module.exports = Rating;
