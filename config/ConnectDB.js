const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// <<<<<<< Thu
// const atlat = "mongodb+srv://truongthihuyenthu:huyenthu06012003@pokedexdb.e17nn.mongodb.net/PokeDexDB?retryWrites=true&w=majority&appName=PokeDexDB"; // Thay <password> bằng mật khẩu của bạn
// =======
// const atlat = "mongodb+srv://tranthiyennhi474803:Yennhi0983994748@cluster0.ahufe.mongodb.net/PokeDexDB?retryWrites=true&w=majority&appName=Cluster0"; // Thay <password> bằng mật khẩu của bạn
// >>>>>>> main
// const atlat = "mongodb+srv://Sainoo19:Sup151151@pokedex.c2vo3.mongodb.net/PokeDex_DB";
const atlat = "mongodb+srv://Sainoo19:Sup151151@pokedex.c2vo3.mongodb.net/PokeDexDB?retryWrites=true&w=majority&appName=PokeDex";


const connect = async () => {
    try {
        await mongoose.connect(atlat, {

        });
        console.log("Connect success");
    } catch (error) {
        console.log("Connect fail");
        console.log(error);
    }
};


module.exports = { connect };
