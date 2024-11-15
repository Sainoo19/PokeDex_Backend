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

router.get('/moves/:name', async function (req, res) {
    try {
        // Tìm Pokémon theo tên
        const pokemon = await Pokemon.findOne({ name: req.params.name });

        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        // Kiểm tra xem Pokémon có moves không
        if (!pokemon.moves || pokemon.moves.length === 0) {
            return res.status(404).json({ message: 'No moves found for this Pokémon' });
        }

        // Trả về danh sách move tên của Pokémon
        const moveNames = pokemon.moves.map(move => move.move); // Giả sử move là đối tượng chứa trường 'move'

        res.status(200).json({ moves: moveNames });
    } catch (error) {
        console.error('Error fetching moves:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;