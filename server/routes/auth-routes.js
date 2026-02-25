const express = require('express')
const Register = require('../controllers/auth-controller')
const router = express.Router()


router.post('/user/register',Register)

module.exports = router