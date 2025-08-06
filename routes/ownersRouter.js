const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');

if(process.env.NODE_ENV === 'development') {
    router.post('/create', async (req, res) => {
        let owner = await ownerModel.find();
        if(owner.length > 0) {
            return res.status(400).send('Owner already exists');
        }
        let { fullname, email, password } = req.body;
        let createdUser = await ownerModel.create({
            fullname,
            email,
            password,
        });
        res.status(201).send(createdUser);
    });
}

router.get('/admin', (req, res) => {
    let success = req.flash('success');
    res.render('createproducts', { success });
});

module.exports = router;