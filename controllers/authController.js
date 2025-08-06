const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateToken');

module.exports.registerUser = async (req, res) => {
   try{
    let { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).send('All fields are required');
    }
    let user = await userModel.findOne({email: email});
    if (user) {
        return res.status(400).send('User already exists');
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                return res.status(500).send('Error hashing password');
            }
            else{
                let user = await userModel.create({
                fullname,
                email,
                password: hash
                });
                let token = generateToken(user);   
                res.cookie('token',token);
                res.send('User registered successfully'); 
            }
        });
    });
   }
   catch(err){
    res.send(err.message);
   }
};

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('All fields are required');
        }
        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(400).send('User not found');
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send('Error comparing passwords');
            }
            if (!isMatch) {
                return res.status(400).send('Invalid credentials');
            }
            let token = generateToken(user);
            res.cookie('token', token);
            req.flash('success', 'Logged in successfully');
            res.redirect('/shop');

        });
    } catch (err) {
        res.send(err.message);
        res.redirect('/');
    }
};

module.exports.logout = (req, res) => {
    res.cookie('token', '');
    res.redirect('/');
};