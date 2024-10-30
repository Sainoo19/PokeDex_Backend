const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evolutionChainSchema = new Schema({
    name: {
        type: String,
        required: true // Tên của Pokémon
    },
    type: {
        type: [String], // Mảng các loại (ví dụ: Grass, Poison)
        required: true
    }
});

const evolutionSchema = new Schema({
    chain_id: {
        type: Number,
        required: true // ID của chuỗi tiến hóa
    },
    evolution_chain: {
        type: [evolutionChainSchema], // Chuỗi tiến hóa chứa các Pokémon
        required: true
    }
});

module.exports = mongoose.model('Evolution', evolutionSchema);
