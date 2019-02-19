import { Router } from 'express';
import mongoose from 'mongoose'
const User = mongoose.model('User')
const Refer = mongoose.model('Refer')
import authenticate from '../middlewares/authenticate'
import { createRefer } from '../validations/refer'

const router = Router();



router.get('/', authenticate, async (req, res, next) => {

    try {
        let refers = await Refer.find({})

        if (refers) return res.status(200).json({ refers: refers })

        return res.status(200).json({ message: 'There is no refer contact.' })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});


router.get('/get-my-refers', authenticate, async (req, res, next) => {
    const { id } = req.currentUser;
    try {
        let refers = await Refer.find({ userId: id })

        if (refers) return res.status(200).json({ refers: refers })

        return res.status(200).json({ message: 'You have no contact to refer.' })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.post('/create-refer', authenticate, async (req, res, next) => {
    const { id } = req.currentUser;
    const { errors, isValid } = createRefer(req.body)
    if (!isValid) { return res.status(500).json({ errors }) }

    try {

        const { contact, name } = req.body;

        let user = await User.findOne({ _id: id })
        let referObj = await Refer.findOne({ contact: contact }, { userId: id })

        if (referObj) return res.status(200).json({ message: 'Refer contact already exist.' })

        let newRefer = new Refer();;
        newRefer.contact = contact;
        newRefer.name = name;
        newRefer.userId = id;
        await newRefer.save();

        user.referId.push(newRefer._id);
        await user.save();

        return res.status(200).json({ newRefer: newRefer });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

export default router;