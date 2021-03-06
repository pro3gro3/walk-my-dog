const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  jobs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Job'
    }
  ]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
