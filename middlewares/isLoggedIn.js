const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports.isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;
        if (!token) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/');
        }
    try {
        let decoded = jwt.verify(token, process.env.JWT_KEY);
        let user = await userModel
        .findOne({email: decoded.email})
        .select('-password');
        if (!user) {
            return res.status(401).send('Invalid token.');
        }
        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        req.flash('error', 'Something went wrong.');
        res.redirect('/');
    }
};