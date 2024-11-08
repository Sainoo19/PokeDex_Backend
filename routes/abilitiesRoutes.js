const express = require('express');
const Ability = require('../models/abilities'); // Assuming you have an Ability model

const router = express.Router();

// GET all abilities
router.get('/abilities', async (req, res) => {
    try {
        const abilities = await Ability.find();
        res.json(abilities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;