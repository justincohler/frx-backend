const User = require('../models/user');
const Prescription = require('../models/prescription');
const config = require('../config.js');

const MESSAGE_UNKNOWN_ERR = 'Something went wrong! Please try again later by texting "SIGNUP".';
const MESSAGE_SIGNUP_PROMPT = 'Welcome to FoodRx! Is it okay if we keep this phone number on file? (Reply "YES" or "NO")';
const MESSAGE_SIGNUP_SUCCESS_1 = 'Welcome to FoodRx! Here is your first code for $10: ';
const MESSAGE_SIGNUP_SUCCESS_2 = ' To request again, reply "REQUEST RX" (Redeemable one per week).'
const MESSAGE_RX_SUCCESS = 'Here is your rx code. Present to the cashier to redeem a discount of $10: ';
const MESSAGE_SIGNUP_REJECT = 'Sorry, but we need to save your phone number in order to provide you with a food prescription.';
const FIRST_RX_DESCRIPTION = "Your first Food prescription!";

exports.sms_rcv_signup = function(req, res, next) {
    const sender = req.body.From;
    const body = req.body.Body;
    const phone = req.body.From;

    var twiml = new config.twilio.TwimlResponse();

    function send_sms(msg, http_status) {
        twiml.message(msg);
        res.writeHead(http_status, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    }

    switch (body.toUpperCase()) {
        case "SIGNUP":
            send_sms(MESSAGE_SIGNUP_PROMPT, 200);
            break;
        case "YES":
            const user = new User({phone});
            user.save().then((user) => {
                const prescription = new Prescription({patient_id: user._id, rx_value: 1000.00, description: FIRST_RX_DESCRIPTION});
                return prescription.save();
            }).then((prescription) => {
                const rx_short = prescription._id.toString().slice(-6);
                const discount = {
                    "pin_required": false,
                    "discount_type": "FIXED",
                    "name": rx_short,
                    "amount_money": {
                        "amount": prescription.rx_value,
                        "currency_code": "USD"
                    }
                }
                // create a discount in FreshTruck Square account
                console.log("Creating discount of name " + rx_short + ".");
                config.square.createDiscount(discount, (discount, err) => {
                    // reply with prescription code
                    const msg = MESSAGE_SIGNUP_SUCCESS_1 + rx_short + MESSAGE_SIGNUP_SUCCESS_2;
                    send_sms(msg, 200);
                });

            }).catch((err) => {
                console.log(err);
                send_sms(MESSAGE_UNKNOWN_ERR, 200);
                return next(err);
            });
            break;
        case "NO":
            send_sms(MESSAGE_SIGNUP_REJECT, 200);
            break;
        case "REQUEST RX":
            // check if the user is signed up
            User.findOne({phone: phone}).then((user) => {
                if (!user) {
                    console.log("Found existing user.");
                    send_sms(MESSAGE_SIGNUP_PROMPT, 200);
                } else {
                    console.log("Did not find existing user.");
                    const prescription = new Prescription({patient_id: user._id, rx_value: 1000.00});
                    return prescription.save();
                }
            })
            // create a user prescription
            .then((prescription) => {
                console.log("Prescription generated in FRx DB.");
                var rx_short = prescription._id.toString().slice(-6);
                const discount = {
                    "pin_required": false,
                    "discount_type": "FIXED",
                    "name": rx_short,
                    "amount_money": {
                        "amount": prescription.rx_value,
                        "currency_code": "USD"
                    }
                }
                // create a discount in FreshTruck Square account
                config.square.createDiscount(discount, (discount, err) => {
                    // reply with prescription code
                    console.log("Discount generated in Square:");
                    console.log(discount);
                    var msg = MESSAGE_RX_SUCCESS + rx_short
                    send_sms(msg, 200);
                    return;
                });
            }).catch((err) => {
                console.log(err);
                send_sms(MESSAGE_UNKNOWN_ERR, 200);
            });
            break;
        default:
            send_sms(MESSAGE_UNKNOWN_ERR, 200);
            break;
    }
}
