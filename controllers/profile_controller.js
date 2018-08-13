const User = require('../models/user');

exports.index = function(req, res, next) {
  const user = req.user;
  Prescription.find({
      "patient_email": user.email
    })
    .exec(function(err, prescriptions) {
      if (err) {
        return next(err)
      }
      res.json(prescriptions)
    });
}

exports.update = function(req, res, next) {
  const user = req.user;

  User.findOneAndUpdate({
      "_id": user._id
    }, user)
    .exec(function(err, user) {
      if (err) {
        return next(err)
      }
      res.json({
        user_id: user_id
      });
    });
}

exports.deactivate = function(req, res, next) {
  const user = req.user;

  User.findOneAndUpdate({
      "_id": user._id
    }, {
      "$set": {
        "active": false,
      }
    })
    .exec(function(err, prescription) {
      if (err) {
        return next(err)
      }
      res.json({
        prescription_id: prescription._id
      });
    });
}
