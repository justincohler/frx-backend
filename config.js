/**
 * Nutritionix API Setup
 */
const NutritionixClient = require('nutritionix');
const nutritionix = new NutritionixClient({
    appId: '', appKey: '', debug: false // defaults to false
});

/**
 * Square API Setup
 */
const square_freshTruck_LocationId = '';
const square_freshTruck_AccessToken = '';
const square_jc_AccessToken = '';
const square_jc_LocationId = '';
const SquareConnect = require('square-connect-api');
const square = new SquareConnect(square_jc_LocationId, square_jc_AccessToken);

/**
 * Twilio API Setup
 */
const twilio_accountSid = '';
const twilio_authToken = '';
const twilio = require('twilio');
const twilio_rest = new twilio.RestClient(twilio_accountSid, twilio_authToken);

/**
 * Configuration Exports for global use throughout this codebase
 * @type {Object}
 */
module.exports = {
    secret: "",
    mongo_url: "mongodb://localhost:foodrx/foodrx",
    nutritionix: nutritionix,
    square: square,
    square_LocationId: square_jc_LocationId,
    twilio: twilio
}
