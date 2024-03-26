const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const { authMiddleWare, authUserMiddleWare } = require('../middlleware/authMiddleware');
const {checkDeleteUser } = require('../middlleware/checkDeleteUser');

router.post('/sign-up', UserController.createUser)
router.post('/sign-in', UserController.loginUser)

router.post('/log-out', UserController.logoutUser)

router.put('/update-user/:id',authUserMiddleWare, UserController.updateUser)
router.delete('/delete-user/:id',checkDeleteUser,authMiddleWare, UserController.deleteUser)
router.get('/getAll',authMiddleWare, UserController.getAllUser)
router.get('/get-details/:id',authUserMiddleWare, UserController.getDetailsUser) 
router.post('/refresh-token', UserController.refreshToken)
router.delete('/delete-many',authMiddleWare ,UserController.deleteManyUser)

router.post('/send-opt',UserController.sendOptCreateAccount)
router.post('/send-opt-forgot-password',UserController.sendOptForgotPassword)

router.put('/forgot-password',UserController.forgotPassword)


module.exports = router