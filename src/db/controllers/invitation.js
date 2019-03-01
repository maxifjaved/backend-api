import mongoose from 'mongoose'
const Invitation = mongoose.model('Invitation')

export function getInvitationByIdentifier(identifier) {
    return Invitation.findOne({ $or: [{ phonenumber: identifier }] })
}

export function isInviteadByUser(phonenumber, user) {
    return Invitation.findOne({ $and: [{ phonenumber: phonenumber }, { user: user }] })
}

export function getInvitationById(id) {
    return Invitation.findById(id)
}

export function getAllInvitations(query, limit, offset) {
    return Promise.all([
        Invitation.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .exec(),

        Invitation.count(query).exec()
    ])
}

export async function createNewInvitation(data, id) {
    try {
        let invitation = new Invitation();
        invitation.name = data.name;
        invitation.phonenumber = data.phonenumber;
        invitation.user = id;

        await invitation.save()
        return invitation;
    } catch (error) {
        throw new Error(error)
    }

}

export function deleteInvitationById(id) {
    return Invitation.remove({ _id: id });
}

