const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  _id: ObjectId,
  id: Number,
  name: String,
  sku: String
});

module.exports = mongoose.model('Product', productSchema);
