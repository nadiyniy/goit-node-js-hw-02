const express = require('express')

const authController = require('../../controllers/auth')
const { usersSchemas, emailSchema } = require('../../validators')
const { validateBody, authenticate, upload } = require('../../middlewares')

const router = express.Router()

router.post('/register', validateBody(usersSchemas.registerUser), authController.register)
router.post('/login', validateBody(usersSchemas.loginUser), authController.login)
router.get('/current', authenticate, authController.current)
router.get('/logout', authenticate, authController.logout)
router.patch('/avatars', upload.single('avatar'), authenticate, authController.updateAvatar)
router.get('/verify/:verificationToken', authController.verify)
router.post('/verify', validateBody(emailSchema), authController.resend)

module.exports = router
