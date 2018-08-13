const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

var prescriptionSchema = new Schema({
  patient_id: {
    type: String,
    required: true
  },
  rx_value: {
    type: Number
  },
  description: {
    type: String
  },
  created_dt: {
    type: Date
  },
  expiration_dt: {
    type: Date
  },
  filled_dt: {
    type: Date
  },
  transaction_id: {
    type: String
  }
});

prescriptionSchema.pre('save', function(next) {
  var prescription = this;
  if (prescription.isNew) {
    prescription.created_dt = new Date();
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model('prescription', prescriptionSchema);
