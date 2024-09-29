const Express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const EmpleadoModel = require("./models/schemas");

const URI = "mongodb://127.0.0.1:27017/Empleados/registro"
const app = Express();
app.use(Express.json());
app.use(cors())

mongoose.connect(URI).then(() => {
    console.log("Conectado a MongoDb");
    app.listen(9940, () => {
        console.log("Servidor corriendo en el puerto 9940")
    });
})
.catch((error) => {
    console.error("Error conectar a MongoDb", error);
})

app.post("/empleados", async (req, res) => {
    const {email, password} = req.body;
    
    if (!email || !password){
        return res.status(400).json("Falta informacion");
    }

    try {
        const user = await EmpleadoModel.findOne({email: email});
        if(user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.json("Permitido");
            } else {
                res.json("Contraseña incorrecta");
            }
        } else {
            res.json("No existe");
        }
    } catch (err) {
        res.status(500).json("Error del servidor")
    }
});       

    
    








