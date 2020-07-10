const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  _id: ObjectId,
  product_id: Number,
  name: String,
  sku: String,
  type: String,
  slug: String,
  variants: [{
    id: Number,
    product_id: Number,
    sku: String,
    sku_id: String,
    price: Number,
    calculated_price: Number,
    sales_price: Number,
    retail_price: Number,
    map_price: Number,
    weight: Number,
    width: Number,
    height: Number,
    depth: Number,
    is_free_shipping: Boolean,
    fixed_cost_shipping_price: Number,
    calculated_weight: Number,
    purchasing_disabled: Boolean,
    purchasing_disabled_message: String,
    image_url: String,
    cost_price: Number,
    upc: String,
    mpn: String,
    gtin: String,
    inventory_level: Number,
    inventory_warning_level: Number,
    bin_picking_number: String,
    option_values: [],
  }],
    date_modified: Date
});

module.exports = mongoose.model('Product', productSchema);
