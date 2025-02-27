import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from "../config.js";

export function createAccessToken(payload){
    // resolve todo termina bien
    // reject todo termina mal
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
        // expira en 1 dia
        {  
            expiresIn: "1d",
        },
        (err, token) => {
            if (err) reject(err)
            resolve(token)
            
            
        }
        );
    })
}