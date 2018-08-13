const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

/**
 * Creates a token for security to pass between user and server
 * @param  {User} user
 * @return {JWT}
 */
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, config.secret);
}

/**
 * Sign in a user
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.signin = function(req, res, next) {
    const user = req.user;
    res.send({token: tokenForUser(user), user_id: user._id});
}

/**
 * Delete a user
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.destroy = function(req, res, next) {
    const user = req.user;
    User.findByIdAndRemove(req.user.email, function(err, user) {
        if (err) {
            return next(err)
        }
        return res.status(200).json({"msg": "Successfully removed user."});
    });
}

/**
 * Sign up a user with email and password
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.signup_with_email = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(422).json({error: "You must provide an email and password"});
    }

    // check if user already exists, send error if they do
    User.findOne({
        email: email
    }, (err, existingUser) => {
        if (err) {
            return next(err)
        }
        if (existingUser) {
            return res.status(422).json({error: "Email taken"})
        }

        var user = new User({email: email, password: password});

        user.save((err, user) => {
            if (err) {
                return next(err)
            }
            return res.json({user_id: user._id, token: tokenForUser(user)});
        });
    });
}
