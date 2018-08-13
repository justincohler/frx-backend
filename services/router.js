const passport = require('passport');

const AuthenticationController = require('../controllers/authentication_controller');
const PrescriptionsController = require('../controllers/prescriptions_controller');
const FoodController = require('../controllers/food_controller');
const ProfileController = require('../controllers/profile_controller');
const SMSController = require('../controllers/sms_controller');
const passportService = require('./passport');

var requireAuth = passport.authenticate('jwt', {
  session: false
});
var requireLogin = passport.authenticate('local', {
  session: false
});
var router = require('express')
  .Router();


/**
 * Auth Routes
 */
router.route('/signup')
  .post(AuthenticationController.signup_with_email)
router.route('/signin')
  .post([requireLogin, AuthenticationController.signin])

/**
 * Profile routes
 */
router.route('/users/:user_id')
  .get(requireAuth, ProfileController.index)
  .patch(requireAuth, ProfileController.update)
  .delete(requireAuth, ProfileController.deactivate)

/**
 * Prescription Routes
 * @type {[type]}
 */
router.route('/users/:user_id/prescriptions')
  .post(requireAuth, PrescriptionsController.create)
  .get(requireAuth, PrescriptionsController.index)

router.route('/users/:user_id/prescriptions/:prescription_id')
  .patch(requireAuth, PrescriptionsController.fill)

/**
 * SMS Routes
 * @type {[type]}
 */
router.route('/sms')
  .post(SMSController.sms_rcv_signup)

/**
 * Nutrition Routes
 * @type {[type]}
 */
router.route('/nutrition')
  .get(FoodController.index)

module.exports = router;
