import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Cambia la URI si es necesario
const MONGODB_URI = 'mongodb://localhost:27017/sgs_db';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

async function crearUsuario() {
  await mongoose.connect(MONGODB_URI);

  const email = 'davidparra@gmail.com'; // Cambia por el correo deseado
  const username = 'davidparra';         // Cambia por el usuario deseado
  const passwordPlano = 'queseyo';       // Cambia por la contraseña deseada
  const passwordEncriptada = await bcrypt.hash(passwordPlano, 10);

  const usuario = new User({
    username,
    email,
    password: passwordEncriptada
  });

  await usuario.save();
  console.log('Usuario creado correctamente');
  mongoose.disconnect();
}

crearUsuario(); 