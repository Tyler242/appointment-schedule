/** Route all /schedule req to correct controller */
// import necessary libraries
const express = require('express');

// import necessary files
const schCtrl = require('../controllers/schedule-ctrl');

// handle HTTP requests
const router = express.Router();

// routing for all /schedule requests

// /schedule/profile => GET
router.get('/profile', schCtrl.getProfile);

// /schedule/profile => POST
router.post('/profile', schCtrl.postProfile);

// /schedule => GET
router.get('/', schCtrl.getSchedule);

module.exports = router;
