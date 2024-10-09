const express = require('express');
const router = express.Router();
const { deleteUser } = require('../controller/controller');

router.delete('/', deleteUser);

module.exports = router;
