import mongoose from 'mongoose';
import * as validation from './user.validation';
const User = mongoose.model('User');

    //TODO:  Change Password
export async function changePassword(req, res, next) {
    const { id } = req.currentUser;

    try {
        const { errors, isValid } = await validation.validatePasswordUpdate(req.body);
        if(!isValid) {
            return res.status(409).json({ errors });
        }
    
        const { oldPassword, newPassword } = req.body;
        const user = await User.getUser(id);
        let ValidatePassword = user.validPassword(oldPassword);

        if(! ValidatePassword) {
            return res.status(401).json({ message: "Invalid old Password"});
        }

        await user.setPassword(newPassword);
        await user.save();
        return res.status(200).json({payload: user.toAuthJSON(), message: "Password Updated Successfully."});

    } catch (e) {

        return res.status(500).json({ errors: { message: e.toString() } });        
    }
}
    //TODO: Update Profile
export async function updateProfile(req, res, next) {
    const { id } = req.currentUser;

    try {
        const { errors, isValid } = await validation.validateUpdateProfile(req.body);
        if(!isValid) {
            return res.status(409).json({ errors });
        }
//TODO: profile image remaining

        const user = await User.getUser(id);
        await user.updateUserProfile(req.body);

        return res.status(200).json({payload: user, message: "Profile Successfully Updated"});
    } catch (e) {
    
        return res.status(500).json({ errors: { message: e.toString() } });        
    }
}

