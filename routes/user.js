const express = require('express');

const router = express.Router();
const {getUserDetails} = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/:id',verifyToken, getUserDetails);

module.exports = router;