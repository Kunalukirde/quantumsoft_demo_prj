const express = require('express');

const router = express.Router();
const {getUserDetails} = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/',verifyToken, getUserDetails);

module.exports = router;