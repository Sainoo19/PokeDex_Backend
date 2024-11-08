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
router.get('/all/', async function (req, res, next) {
    try {
        const allPokemon = await Pokemon.find();
        console.log(allPokemon);
        res.status(200).json(allPokemon);
    } catch (error) {
        console.error("Error fetching Pokemon:", error.message);

        res.status(500).json({ message: error.message });
    }
});
router.get('/top-attack', async function (req, res, next) {
    try {
        const topAttackPokemon = await Pokemon.find().sort({ 'base_stats.attack': -1 }).limit(7);
        res.status(200).json(topAttackPokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/check-duplicates', async (req, res) => {
    try {
        const duplicates = await Pokemon.aggregate([
            {
                $group: {
                    _id: "$name", // Nhóm theo tên Pokémon
                    count: { $sum: 1 } // Đếm số lượng bản ghi cho mỗi tên
                }
            },
            {
                $match: {
                    count: { $gt: 1 } // Chỉ giữ lại các nhóm có số lượng lớn hơn 1
                }
            }
        ]);

        res.status(200).json(duplicates);
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

router.get('/filter/types', async function (req, res, next) {
    try {
        const types = req.query.types.split(',');
        const pokemons = await Pokemon.find({ type: { $all: types } });
        if (pokemons.length === 0) {
            return res.status(404).json({ message: 'No Pokemon found with these types' });
        }
        res.status(200).json(pokemons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/filter/weakness/:type', async function (req, res) {
    try {
        const type = await Type.findOne({ name: req.params.type });
        if (!type) {
            return res.status(404).json({ message: 'Type not found' });
        }
        const weaknessTypes = type.weaknesses;
        const pokemonList = await Pokemon.find({ type: { $in: weaknessTypes } });
        if (pokemonList.length === 0) {
            return res.status(404).json({ message: 'No Pokemon found with this weakness type' });
        }
        res.status(200).json(pokemonList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/filter/height', async function (req, res, next) {
    try {
        const heightCategory = req.query.category;
        let heightFilter;

        switch (heightCategory) {
            case 'small':
                heightFilter = { height: { $lte: 1 } };
                break;
            case 'medium':
                heightFilter = { height: { $gt: 1, $lte: 3 } };
                break;
            case 'large':
                heightFilter = { height: { $gt: 3 } };
                break;
            default:
                return res.status(400).json({ message: 'Invalid height category' });
        }

        const pokemons = await Pokemon.find(heightFilter);
        res.status(200).json(pokemons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/filter/weight', async function (req, res, next) {
    try {
        const weightCategory = req.query.category;
        let weightFilter;

        switch (weightCategory) {
            case 'small':
                weightFilter = { weight: { $lte: 100 } };
                break;
            case 'medium':
                weightFilter = { weight: { $gt: 100, $lte: 300 } };
                break;
            case 'large':
                weightFilter = { weight: { $gt: 300 } };
                break;
            default:
                return res.status(400).json({ message: 'Invalid weight category' });
        }

        const pokemons = await Pokemon.find(weightFilter);
        res.status(200).json(pokemons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;