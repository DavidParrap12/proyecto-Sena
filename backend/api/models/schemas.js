const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const EmpleadoSchema = new mongoose.Schema({
    email: {type: String, 
        required: true, 
        unique: true
    }, 
    password: {type: String, 
        required: true
    }
})

EmpleadoSchema.pre("save", function (next) {
    if (!this.isModified("password")){
        return next();
    }
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        this.password = hash;
        next();
    })
})

const EmpleadoModel = mongoose.model("Empleados", EmpleadoSchema)
module.exports = {
    EmpleadoModel
};