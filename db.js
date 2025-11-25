// const mysql = require('mysql2');
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'AuthSystem'
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//     }
//     else {
//         console.log('MySQL Connected');
//     }
// });


//     module.exports = db;








const mysql = require('mysql2');
const fs = require('fs');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync('ca.pem')
    }
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to Aiven MySQL successfully!");
    }
});

module.exports = db;
