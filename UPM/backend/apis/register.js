const express = require('express');
const router = express.Router();
const { registerUser } = require('../controller/controller');


// ip = /http://localhost:5000 

// path = /api/login

// final = ip+path

router.post('/', registerUser);

module.exports = router;
