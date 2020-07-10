const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const StoreSchema = new Schema({
  _id: ObjectId,
  hash: String,
  domain: String,
  secure_url: String,
  control_panel_base_url: String,
  status: String,
  name: String,
  first_name: String,
  last_name: String,
  address: String,
  country: String,
  country_code: String,
  phone: Number,
  admin_email: String,
  order_email: String,
  favicon_url: String,
  timezone: {
    name: String,
    raw_offset: Number,
    dst_offset: Number,
    dst_correction: Boolean,
    date_format: {
      diplay: String,
      export: String,
      extended_display: String
    }
  },
    language: String,
    currency: String,
    currency_symbol: String,
    decimal_separator: String,
    thousands_separator: String,
    decmial_places: Number,
    currency_symbol_location: String,
    weight_units: String,
    dimension_units: String,
    dimension_decimal_places: Number,
    dimension_decimal_token: String,
    plan_name: String
  }
);

module.exports = mongoose.model('Store', StoreSchema);
