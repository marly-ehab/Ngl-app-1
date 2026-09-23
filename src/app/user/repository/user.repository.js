import {User} from "../model/user.model.js";

export async function updateUserByEmail(email, updatedData) {
    return User.findOneAndUpdate(
        {email: email},
        updatedData,
        {new: true}
    );
}