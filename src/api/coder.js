import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export default class Coder {
    static async jwtEncode(payload) {
        return jwt.sign(payload, process.env.SECRET, {expiresIn: '1h'});
    }
    static async jwtDecode(token) {
        return jwt.verify(token, process.env.SECRET);
    }

    static async hash(plaintext) {
        return await bcrypt.hash(plaintext, 10);
    }
    static async compare(plaintext, hash) {
        return bcrypt.compare(plaintext, hash);
    }
}
