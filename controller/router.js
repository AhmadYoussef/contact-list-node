const express = require('express');
const router = express.Router();
const controller = require('./contoller');

// router.get("/", controller.homeRoute);

router.post('/newContact', controller.newContact);

router.post('/uploadAvatar', controller.uploadAvatar);

router.get('/getContactList/:id', controller.getContactList);

router.get('/deleteContact/:id', controller.deleteContact);

router.post('/sendMail', controller.sendMail);

router.post("/updateContact", controller.updateContact);

router.post('/newUser', controller.newUser);

router.post('/loginUser', controller.loginUser);

module.exports = router;
