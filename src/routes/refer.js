import { Router } from 'express';
import mongoose from 'mongoose'
const User = mongoose.model('User')
const Refer = mongoose.model('Refer')
import authenticate from '../middlewares/authenticate'
import { createRefer, checkContact } from '../validations/refer'

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
});


router.get('/get-my-refers', authenticate, async (req, res, next) => {

    const { id } = req.currentUser
    var query = { userId: id }
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

router.post('/create-refer', authenticate, async (req, res, next) => {
    const { id } = req.currentUser;
    const { errors, isValid } = createRefer(req.body)
    if (!isValid) { return res.status(500).json({ errors }) }

    try {

        const { contact, name } = req.body;

        let user = await User.findOne({ _id: id })
        let contactUser = await User.findOne({ phonenumber: contact })
        let referObj = await Refer.findOne({ contact: contact }, { userId: id })

        if (referObj) {
            if (referObj.status === true) return res.status(200).json({ message: 'Refer contact already exist in DB.' })

            // const accountSid = process.env.TWILIO_ACCOUNT_SID
            // const authToken = process.env.TWILIO_ACCOUNT_TOKEN
            // const from = process.env.TWILIO_PHONE_NUMBER
            // const client = require('twilio')(accountSid, authToken);
            // let activationCode = Math.floor(Math.pow(10, 4 - 1) + Math.random() * (Math.pow(10, 4) - Math.pow(10, 4 - 1) - 1))

            // client.messages.create({
            //     to: contact,
            //     from: from,
            //     body: 'Welcome to WEYNON. Your activation code is ' + activationCode,
            // }, async (err, message) => {
            //     if (err) return res.status(500).json({ message: "Message not sent. Please verify your number.", error: err });

            return res.status(500).json({ message: "User already invited." });
            // })
        } else {
            if (contactUser) return res.status(200).json({ message: 'User already exist with this contact.' })

            // const accountSid = process.env.TWILIO_ACCOUNT_SID
            // const authToken = process.env.TWILIO_ACCOUNT_TOKEN
            // const from = process.env.TWILIO_PHONE_NUMBER
            // const client = require('twilio')(accountSid, authToken);
            // let activationCode = Math.floor(Math.pow(10, 4 - 1) + Math.random() * (Math.pow(10, 4) - Math.pow(10, 4 - 1) - 1))

            // client.messages.create({
            //     to: contact,
            //     from: from,
            //     body: 'Welcome to WEYNON. Your activation code is ' + activationCode,
            // }, async (err, message) => {
            //     if (err) return res.status(500).json({ message: "Message not sent. Please verify your number.", error: err });

            //     let sendMessage = await message

            let newRefer = new Refer();
            newRefer.contact = contact;
            newRefer.name = name;
            newRefer.code = activationCode;
            newRefer.userId = id;
            await newRefer.save();

            user.referId.push(newRefer._id);
            await user.save();

            return res.status(200).json({ newRefer: newRefer });
            // })
        }
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.post('/check-refer-contact', authenticate, async (req, res, next) => {


    try {
        const contactList = req.body;
        let phonenumberList = [];
        for (let i = 0; i < contactList.length; i++) {
            let obj = { name: "", contact: "", status: "", existing: "" }

            let name = contactList[i].name
            let contact = contactList[i].contact

            let referObject = await Refer.findOne({ $and: [{ name: name }, { contact: contact }] })
            if (referObject) {
                obj.name = name
                obj.contact = contact
                obj.status = referObject.status
                obj.existing = 'user invited'
                phonenumberList.push(obj)
            } else {
                obj.name = name
                obj.contact = contact
                obj.status = 'user not exist'
                obj.existing = 'false'
                phonenumberList.push(obj)
            }
        }
        return res.status(200).json({ phonenumberList: phonenumberList })

    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});


export default router;