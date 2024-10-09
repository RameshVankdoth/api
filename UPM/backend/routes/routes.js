const express = require('express');
const router = express.Router();
const loginRoute = require('../apis/login');
const registerRoute = require('../apis/register');
const updateRoute = require('../apis/update');
const deleteRoute = require('../apis/delete');

router.use('/login', loginRoute);
router.use('/register', registerRoute);
router.use('/update', updateRoute);
router.use('/delete', deleteRoute);

module.exports = router;
