import { Router } from 'express';
import mongoose from 'mongoose'
import { getInvitationByIdentifier, getAllInvitations, createNewInvitation } from '../db/controllers/invitation'
import { getUserByIdentifier } from '../db/controllers/user'
import authenticate from '../middlewares/authenticate'
import { validateInvitation } from '../validations/invitation'

const router = Router();



router.get('/', authenticate, async (req, res, next) => {
    var query = {};
    var limit = 20;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }
    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }

    try {
        let results = await getAllInvitations(query, limit, offset);
        return res.status(200).json({ invitations: results[0], total: results[1] })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});


router.get('/get-my-invitations', authenticate, async (req, res, next) => {
    const { id } = req.currentUser
    var query = { user: id }
    var limit = 20;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }
    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }
    if (typeof req.query.status !== 'undefined') {
        query = { ...query, $and: [{ status: status }] };
    }

    Promise.all([
        Refer.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .populate('userId')
            .exec(),

        Refer.count(query).exec(),
    ]).then(function (results) {
        var refer = results[0];
        var referCount = results[1];

        return res.status(200).json({ refer, referCount })
    })
})

router.post('/send-invitation', authenticate, async (req, res, next) => {
    const { id } = req.currentUser;
    const { errors, isValid } = validateInvitation(req.body);

    if (!isValid) { return res.status(500).json({ errors }) }

    try {
        const { phonenumber } = req.body
        let user = await getUserByIdentifier(phonenumber);
        if (user) { return res.status(500).json({ errors: { phonenumber: 'User already exists in system.' } }) }

        let invited = await getInvitationByIdentifier(phonenumber, id)
        if (invited) { return res.status(500).json({ errors: { phonenumber: 'Invitation is already sent to this user.' } }) }

        if (!invited) {
            let invitation = await createNewInvitation(req.body, id);
            return res.status(200).json({ message: 'Invitation sent to user.', invitation })
        }
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});



export default router;