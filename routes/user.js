const express = require('express');

const router = express.Router();
const {getUserDetails} = require('../controllers/userController');
const {AddUserDetails} = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/',verifyToken, getUserDetails);
router.post('/',verifyToken, AddUserDetails);

module.exports = router;