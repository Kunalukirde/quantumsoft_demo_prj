const db = require('../db.js');

exports.getUserDetails = async (req, res) => { 
    const userId = req.params.id;


        const sql = `SELECT id, f_Name, l_Name, dob, email, mobile FROM registeruser WHERE id = ?`;

        db.query(sql, [userId], (err, results) => {
            if(err || results.length === 0) {
                return res.status(404).json({status: 404, message: 'User not found.'});
            }

            res.status(200).json({status : 200, message : 'User details fetched successfully', user : results[0]});
        });
};

