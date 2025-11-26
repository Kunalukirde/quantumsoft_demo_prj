const db = require('../db.js');



exports.AddUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { qualification, role, experience, skills, address } = req.body;

        const checkSql = `SELECT * FROM user_info WHERE user_id = ?`;
        db.query(checkSql, [userId], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Check error:', checkErr);
                return res.status(500).json({ status: 500, message: 'Database Error' });
            }

            if (checkResult.length > 0) {
                return res.status(400).json({
                    status: 400,
                    message: "User info already exists. You cannot add again."
                });
            }
            const insertSql = `INSERT INTO user_info (user_id, qualification, role, experience, skills, street, city, state, country, pincode) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                userId,
                qualification,
                role,
                experience,
                skills,
                address.street,
                address.city,
                address.state,
                address.country,
                address.pincode
            ];

            db.query(insertSql, values, (insertErr, result) => {
                if (insertErr) {
                    console.error('Error inserting user details:', insertErr);
                    return res.status(500).json({ status: 500, message: 'Database Error' });
                }

                res.status(201).json({
                    status: 201,
                    message: 'User info saved successfully',
                    userId: result.insertId
                });
            });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ status: 500, message: 'Server Error' });
    }
};


exports.getUserDetails = async (req, res) => { 
    const userId = req.user.id;

    const sql_user = `SELECT id, f_Name, l_Name, dob, email, mobile FROM registeruser WHERE id = ?`;

    const sql_info = `SELECT user_id, qualification, role, experience, skills, street, city, state, country, pincode FROM user_info WHERE user_id = ?`;

    try {
        // Convert db.query into Promises
        const query = (sql, params) => {
            return new Promise((resolve, reject) => {
                db.query(sql, params, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        };

        const [userData, userInfo] = await Promise.all([
            query(sql_user, [userId]),
            query(sql_info, [userId])
        ]);

        if (userData.length === 0)
            return res.status(404).json({ status: 404, message: "User not found" });

        if (userInfo.length === 0)
            return res.status(404).json({ status: 404, message: "User info not found" });

        // Merge tables
        const combined = {
            ...userData[0],
            ...userInfo[0]
        };

        return res.status(200).json({
            status: 200,
            message: "User details fetched successfully",
            data: combined
        });

    } catch (err) {
        console.error("Error fetching user details:", err);
        return res.status(500).json({ status: 500, message: "Server error" });
    }
};



    
    
    
    