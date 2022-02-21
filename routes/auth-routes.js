// import useful libraries
const express = require('express');

// import necessary files
const authCtrl = require('../controllers/auth-ctrl');

// handle HTTP requests
const router = express.Router();

// router for all '/login' routes

// /login => GET
router.get('/login', authCtrl.getLogin);

// /login => POST
router.post('/login', authCtrl.postLogin);

// /register => GET
router.get('/register', authCtrl.getRegister);

// /register => POST
router.post('/register', authCtrl.postRegister);

// /logout => POST
router.post('/logout', authCtrl.postLogout);

module.exports = router;
