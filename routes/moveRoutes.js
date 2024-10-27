var express = require('express');
var router = express.Router();
var Move = require('../models/move');



//API để lấy tất cả cái moves
router.get('/', async function (req, res, next) {
    try {
        const moves = await Move.find();
        console.log(moves);
        res.status(200).json(moves);
    } catch (error) {
        console.error("Error fetching move:", error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;