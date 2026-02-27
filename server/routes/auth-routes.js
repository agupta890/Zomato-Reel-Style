const express = require('express')
const {Register,Login} = require('../controllers/auth-controller')
const router = express.Router()


router.post('/user/register',Register)
router.post('/user/login',Login)

module.exports = router