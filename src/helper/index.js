export function usernameIsValid(username = '') {
    return /^[0-9a-zA-Z_.-]+$/.test(username);
}