const express = require('express');

const authController = require('../../controllers/auth');
const { usersSchemas } = require('../../validators');
const { validateBody, authenticate } = require('../../middlewares');

const router = express.Router();

router.post('/register', validateBody(usersSchemas.registerUser), authController.register);
router.post('/login', validateBody(usersSchemas.loginUser), authController.login);
router.get('/current', authenticate, authController.current);
router.get('/logout', authenticate, authController.logout);

module.exports = router;
