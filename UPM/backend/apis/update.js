const express = require('express');
const router = express.Router();
const { updateUser } = require('../controller/controller');

router.put('/', updateUser);

module.exports = router;
