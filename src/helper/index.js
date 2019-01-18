import jwt from 'jsonwebtoken';

export function usernameIsValid(username = '') {
    return /^[0-9a-zA-Z_.-]+$/.test(username);
}

export async function decodToken(token, secrect) {
    try {
        return await jwt.verify(token, secrect)
    } catch (error) {
        throw new Error(error)
    }
}