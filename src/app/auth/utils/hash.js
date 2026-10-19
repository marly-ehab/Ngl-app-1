import bcrypt from "bcrypt";

export async function hashPassword(password) {
    return bcrypt.hash(String(password), 10);
}

export async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(String(password), hashedPassword);
}