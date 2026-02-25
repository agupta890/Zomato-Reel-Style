const express = require('express')
const Register = require('../controllers/auth-controller')
const router = express.Router()


router.get('/user/register',Register)

module.exports = router