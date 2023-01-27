const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const nodemailer = require('nodemailer')
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateChangePassword = require('../validation/change-password');

const User = require('../models/User');

const credentials = {
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'support@cryptotools.live',
        pass: 'Token!23'
    }
}
const transporter = nodemailer.createTransport(credentials)

router.post('/register', function (req, res) {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                });
                        }
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            if (!user.verified) {
                errors.verified = "You didn't verified User"
                return res.status(404).json(errors)
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName
                        }
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if (err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                });
        });
});

router.post('/change-password', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateChangePassword(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.current_password;
    const newpassword = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        bcrypt.genSalt(10, (err, salt) =>
                            bcrypt.hash(newpassword, salt, (err, hash) => {
                                if (err) console.error('There was an error', err);
                                user.password = hash;
                                user.save();
                            })
                        );
                        res.json({
                            success: true,
                            password: 'successfully change password'
                        });
                    }
                    else {
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                });
        });
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
    });
});

router.post('/sendMail', (req, res) => {
    User.findByIdAndUpdate(req.body.id, { verifyCode: req.body.code }, (err, docs) => {
        if (err)
            console.log('error', err)
        else
            console.log('docs', docs)
    })
    let message = {
        from: 'support@cryptotools.live',
        to: req.body.email,
        subject: 'Confirm your email',
        // html: `<h2>Congratulations ${req.body.firstName} ${req.body.lastName}! You have successfully registered.</h2><a href="http://152.89.247.244:5000/api/users/verify?id=${req.body.id}" target="_blank" style="cursor: pointer"><button style="display: inline-block; padding: 0.3em 1.2em; margin: 0 0.3em 0.3em 0; border-radius: 2em; border: none; box-sizing: border-box; text-decoration: none; font-weight: 300; color: #FFFFFF; background-color: #4ef18f; text-align: center; transition: all 0.2s; cursor: pointer">Click To Verify</button></a>`
        html: `<h2>Congratulations ${req.body.firstName} ${req.body.lastName}! You have successfully registered.</h2><p>This is confirmation code: ${req.body.code}</p>`
    }
    transporter.sendMail(message, async (err, info) => {
        if (err) {
            console.log('error', err)
            return res.status(400).json(err)
        } else {
            console.log('info', info)
            return res.status(200).json(info)
        }
    })
});

router.post('/checkCode', (req, res) => {
    User.findById(req.body.id, (err, docs) => {
        if (err)
            console.error("Invalid user id")
        else {
            if (req.body.code == docs.verifyCode) {
                console.log('dosc', docs)
                const payload = {
                    id: docs._id,
                    firstName: docs.firstName,
                    lastName: docs.lastName
                }
                jwt.sign(payload, 'secret', {
                    expiresIn: 3600
                }, (err, token) => {
                    if (err) console.error('There is some error in token', err);
                    else {
                        res.json({
                            success: true,
                            token: `Bearer ${token}`
                        });
                    }
                });
            } else {
                console.error("Invalid confirm code")
                res.status(404).json({
                    error: 'Invalid Confirm Code'
                })
            }
        }
    })
})

router.get('/verify/', (req, res) => {
    User.findByIdAndUpdate(req.query.id, { verified: true }, (err, docs) => {
        if (err)
            console.log('error', err)
        else
            console.log('docs', docs)
        res.redirect('http://152.89.247.244:3000')
    })
})

module.exports = router;