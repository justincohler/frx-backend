const Prescription = require('../models/prescription');

/**
 * Create a new Prescription of 10.00 for a given patient with optional description and expiration_dt
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.create = function(req, res, next) {
    const rx_value = 1000.00;
    const patient_id = req.body.patient_id;
    const description = req.body.description;
    const expiration_dt = req.body.expiration_dt;

    const prescription = new Prescription({patient_id, rx_value, description, expiration_dt});

    prescription.save().then((prescription) => {
        res.json(prescription);
    }).catch(next);
}

/**
 * Return all prescriptions assigned to a given patient
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.index = function(req, res, next) {
    const user = req.user;
    Prescription.find({"patient_id": user._id}).exec(function(err, prescriptions) {
        if (err) {
            return next(err)
        }
        res.json(prescriptions)
    });
}

/**
 * Mark a prescription as filled by adding a filled_dt matching the date of the transaction at the point-of-sale
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.fill = function(req, res, next) {
    const prescription_id = req.body.prescription_id;
    const transaction_id = req.body.transaction_id;
    const filled_dt = req.body.filled_dt;

    Prescription.findOneAndUpdate({
        "_id": prescription_id
    }, {
        "$set": {
            "filled_dt": filled_dt,
            "transaction_id": transaction_id
        }
    }).exec(function(err, prescription) {
        if (err) {
            return next(err)
        }
        res.json(prescription);
    });
}
