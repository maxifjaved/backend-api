import mongoose from 'mongoose'
const UserGroup = mongoose.model('Group');


export function getUserGroupById(id) {
    return UserGroup.findById(id)

}

export function getAllUserGroups() {
    return UserGroup.find({})
}

export function isGroupExists(query) {
    return UserGroup.count(query);
}

export function deleteGroupById(id) {
    return UserGroup.remove({ _id: id });
}