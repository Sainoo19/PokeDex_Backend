const express = require('express');
const Type = require('../models/type'); // Assuming you have a Type model

const router = express.Router();


// Route to get all types
router.get('/types', async function (req, res, next) {
    try {
        const types = await Type.find();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get weaknesses of a specific type
router.get('/weaknesses/:name', async function (req, res, next) {
    try {
        const typeName = req.params.name;
        const type = await Type.findOne({ name: typeName });
        if (!type) {
            return res.status(404).json({ message: 'Type not found' });
        }
        res.status(200).json(type.weaknesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;