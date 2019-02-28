import mongoose from 'mongoose'
const UserGroup = mongoose.model('Group');


export function getUserGroupById(id) {
    return UserGroup.findById(id)

}

export function getAllUserGroups() {
    return UserGroup.find({})
}

export function deleteGroupById(id) {
    return UserGroup.remove({ _id: id });
}