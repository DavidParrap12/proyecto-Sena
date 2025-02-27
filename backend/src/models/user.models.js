import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    // para decir que es lo que voy a guardar
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

}, {
    timestamps: true,
})

// para interactuar con la base de datos
export default mongoose.model('user', userSchema)