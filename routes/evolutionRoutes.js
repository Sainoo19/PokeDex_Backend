var express = require('express');
var router = express.Router();
var Evolution = require('../models/evolution');

// Lấy toàn bộ chuỗi tiến hóa hoặc một chuỗi tiến hóa dựa trên tên Pokémon
router.get('/:name?', async function (req, res, next) {
    try {
        // Nếu không có tên Pokémon, trả về toàn bộ danh sách chuỗi tiến hóa
        if (!req.params.name) {
            const allEvolutionChains = await Evolution.find();
            return res.status(200).json(allEvolutionChains);
        }

        // Nếu có tên Pokémon, tìm chuỗi tiến hóa dựa trên tên
        const evolutionChain = await Evolution.findOne({ "evolution_chain.name": req.params.name });
        if (!evolutionChain) {
            return res.status(404).json({ message: 'Evolution chain not found' });
        }

        res.status(200).json(evolutionChain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
