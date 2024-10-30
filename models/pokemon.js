const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const abilitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    effect: {
        type: String,
        required: true
    }
});

const moveSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    pp: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const evolutionSchema = new Schema({
    to: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    }
});

const pokemonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: [String],
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    abilities: {
        type: [abilitySchema],
        required: true
    },
    base_stats: {
        hp: {
            type: Number,
            required: true
        },
        attack: {
            type: Number,
            required: true
        },
        defense: {
            type: Number,
            required: true
        },
        special_attack: {
            type: Number,
            required: true
        },
        special_defense: {
            type: Number,
            required: true
        },
        speed: {
            type: Number,
            required: true
        }
    },
    moves: {
        type: [moveSchema],
        required: true
    },
    generation: {
        type: Number,
        required: true
    },
    evolutions: {
        type: [evolutionSchema],
        required: true
    }
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;