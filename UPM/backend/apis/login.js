const express = require('express');
const router = express.Router();
const { loginUser } = require('../controller/controller');

router.post('/', loginUser);

module.exports = router;
