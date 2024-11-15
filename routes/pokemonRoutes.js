var express = require('express');
var router = express.Router();
var Pokemon = require('../models/pokemon');
var Type = require('../models/type');
var Move = require('../models/move');
var Abilities = require('../models/abilities');

router.post('/', async function (req, res, next) {
    try {
        const newPokemon = new Pokemon(req.body);
        const savedPokemon = await newPokemon.save();
        res.status(201).json(savedPokemon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Endpoint to fetch all Pokémon
router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        res.status(200).json(pokemons);
    } catch (error) {
        console.error('Error fetching Pokémon:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to fetch Pokémon by name
router.get('/name/:name', async (req, res) => {
    try {
        const pokemon = await Pokemon.findOne({ name: req.params.name });
        if (!pokemon) {
            return res.status(404).json({ message: 'Pokémon not found' });
        }
        res.status(200).json(pokemon);
    } catch (error) {
        console.error('Error fetching Pokémon:', error.message);
        res.status(500).json({ message: error.message });
    }
});


router.delete('/:id', async function (req, res, next) {
    try {
        const deletedPokemon = await Pokemon.findByIdAndDelete(req.params.id);
        if (!deletedPokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }
        res.status(200).json({ message: 'Pokemon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/random', async function (req, res, next) {
    try {
        const count = await Pokemon.countDocuments();
        const random = Math.floor(Math.random() * count);
        const randomPokemons = await Pokemon.find().skip(random).limit(7);
        res.status(200).json(randomPokemons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/all', async function (req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Kiểm tra nếu có tham số 'types'
    if (req.query.types) {
        const types = Array.isArray(req.query.types) ? req.query.types : [req.query.types];
        filter.type = { $in: types };
    }

    // Kiểm tra nếu có tham số 'ability'
    if (req.query.ability) {
        filter.ability = req.query.ability;
    }

    // Kiểm tra nếu có tham số 'height'
    if (req.query.height) {
        switch (req.query.height) {
            case 'small':
                filter.height = { $lte: 1 };
                break;
            case 'medium':
                filter.height = { $gt: 1, $lte: 3 };
                break;
            case 'large':
                filter.height = { $gt: 3 };
                break;
            default:
                return res.status(400).json({ message: 'Invalid height category' });
        }
    }

    // Kiểm tra nếu có tham số 'weight'
    if (req.query.weight) {
        switch (req.query.weight) {
            case 'small':
                filter.weight = { $lte: 100 };
                break;
            case 'medium':
                filter.weight = { $gt: 100, $lte: 300 };
                break;
            case 'large':
                filter.weight = { $gt: 300 };
                break;
            default:
                return res.status(400).json({ message: 'Invalid weight category' });
        }
    }

    // Kiểm tra nếu có tham số 'weakness'
    try {
        if (req.query.weakness) {
            const type = await Type.findOne({ name: req.query.weakness });
            if (!type) {
                return res.status(404).json({ message: 'Weakness type not found' });
            }
            const weaknessTypes = type.weaknesses;
            filter.type = { $in: weaknessTypes };
        }

        // Thêm tính năng tìm kiếm tên Pokémon
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: 'i' };  // Tìm kiếm không phân biệt hoa thường
        }

        // Lấy danh sách Pokémon từ cơ sở dữ liệu
        const allPokemon = await Pokemon.find(filter).skip(skip).limit(limit);
        const totalCount = await Pokemon.countDocuments(filter);

        res.set('x-total-count', totalCount);
        res.status(200).json(allPokemon);
    } catch (error) {
        console.error("Error fetching Pokemon:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.get('/top-attack', async function (req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;

    try {
        const topAttackPokemon = await Pokemon.find().sort({ 'base_stats.attack': -1 }).skip(skip).limit(limit);
        res.status(200).json(topAttackPokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:name', async function (req, res, next) {
    try {
        const pokemon = await Pokemon.findOne({ name: req.params.name });
        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }
        res.status(200).json(pokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/type/:name', async function (req, res, next) {
    try {
        const pokemon = await Pokemon.findOne({ name: req.params.name });
        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }
        res.status(200).json({ type: pokemon.type });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint lấy base_stats --PHẦN MỚI THÊM (VY)
router.get('/:id/stats', async function (req, res, next) {
    try {
        // Tìm Pokémon theo ID và chỉ lấy phần base_stats
        const pokemon = await Pokemon.findById(req.params.id, 'base_stats');
        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }
        res.status(200).json(pokemon.base_stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint để lấy weaknesses của Pokemon theo tên --PHẦN MỚI THÊM (VY)
router.get('/:name/weaknesses', async function (req, res) {
    try {
        // Tìm Pokémon theo tên
        const pokemon = await Pokemon.findOne({ name: req.params.name });

        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        // Lấy danh sách các loại của Pokémon
        const pokemonTypes = pokemon.type;

        // Tìm weaknesses từ bảng Type dựa trên các loại của Pokémon
        const weaknesses = await Type.find({ name: { $in: pokemonTypes } })
            .select('weaknesses -_id'); // Chỉ lấy trường weaknesses

        // Gộp tất cả weaknesses từ nhiều loại thành một mảng duy nhất
        const combinedWeaknesses = weaknesses.flatMap(type => type.weaknesses);

        res.status(200).json({ weaknesses: combinedWeaknesses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Endpoint để lấy moves của Pokemon theo tên --PHẦN MỚI THÊM (VY)
router.get('/:name/moves', async function (req, res) {
    try {
        // Tìm Pokémon theo tên
        const pokemon = await Pokemon.findOne({ name: req.params.name });

        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        // Lấy danh sách moves từ Pokémon
        const moves = pokemon.moves;

        res.status(200).json({ moves });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});








module.exports = router;