const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
    const {fName,lName, dob, email,mobile, password } = req.body;
    if(!fName || !lName|| !dob || !email || !password || !mobile) {
        return res.status(400).json({status : 400,message: 'All fields are required'});
    }
    
    const hashedPassowrd = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO registeruser (f_Name,l_Name, dob, email, password, mobile) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql , [fName, lName, dob, email, hashedPassowrd, mobile], (err, result) => {
        if(err) {
            return res.status(422).json({status : 422 ,message: 'User is Already Exist in Database'});
        }
        res.status(201).json({status : 200,message: 'User registered successfully'});
    });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM registeruser WHERE email = ?`;

    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'User does not exist',
                mandatoryDataFound: false
            });
        }

        const fetchedUser = results[0];
        const passwordMatch = await bcrypt.compare(password, fetchedUser.password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid email or password',
                mandatoryDataFound: false
            });
        }

        // 🔍 STEP 2: Check mandatory user details
        const checkUserInfoSQL = `SELECT id FROM user_info WHERE user_id = ?`;

        db.query(checkUserInfoSQL, [fetchedUser.id], (infoErr, infoResults) => {
            if (infoErr) {
                return res.status(500).json({
                    status: 500,
                    message: 'Database error',
                    mandatoryDataFound: false
                });
            }

            const mandatoryDataFound = infoResults.length > 0;

            // Create JWT token
            const token = jwt.sign(
                { id: fetchedUser.id, email: fetchedUser.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            const { password: _, ...safeUser } = fetchedUser;

            res.status(200).json({
                status: 200,
                message: 'Login successfully',
                user: safeUser,
                token,
                mandatoryDataFound   // 👈 Final boolean
            });
        });
    });
};

