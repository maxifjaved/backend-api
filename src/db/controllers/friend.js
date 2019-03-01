import mongoose from 'mongoose'
const Friend = mongoose.model('Friend')

export function getAllFriends(query, limit, offset) {
    return Promise.all([
        Friend.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .exec(),

        Friend.count(query).exec()
    ])
}

export function createNewFriend(data) {
    const { currentUserId, friendId, groudId } = data;

    let myInvitation = new Friend({
        user: currentUserId,
        friend: friendId,
        group: groudId,
        status: 'invite'
    });

    let fRequest = new Friend({
        user: friendId,
        friend: currentUserId,
        group: groudId,
        status: 'request'
    });

    return Promise.all([
        myInvitation.save(),
        fRequest.save()
    ])
}

export function isFriendExists(query) {
    return Friend.count(query);
}

export function deleteFriendById(id) {
    return Friend.remove({ _id: id });
}

