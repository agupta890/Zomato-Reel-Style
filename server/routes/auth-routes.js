const express = require('express')
const {Register,Login, Logout} = require('../controllers/auth-controller')
const router = express.Router()


router.post('/user/register',Register)
router.post('/user/login',Login)
router.get('/user/logout',Logout)
module.exports = router