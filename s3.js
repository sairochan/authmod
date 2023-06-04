const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const mysql = require('mysql');
const bodyParser = require("body-parser");

require('dotenv/config');
router.use(bodyParser.json({ limit: '500mb' }));
router.use(bodyParser.urlencoded({ limit: '500mb', extended:  true  }))
const storage = multer.memoryStorage({
    destination: function(req, file, cb) {
        cb(null, '');
    }
});

const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: filefilter });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});

// const db = mysql.createConnection({
//     host: "database-1.csd525txjwzl.us-east-2.rds.amazonaws.com",
//     port: "3306",
//     user: "admin",
//     password: "password!",
//     database: "regent1",
//     multipleStatements: true
// });

// db.connect((err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('MySQL database connected successfully');
//     }
// });

// router.post('/imageUpload', (req, res) => {
//     console.log(res);

//     const params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: req.body.originalname,
//         Body: new Uint8Array(req.body.buffer),
//         ACL: 'public-read-write',
//         ContentType: 'image/jpeg'
//     };

//     s3.upload(params, (error, data) => {
//         if (error) {
//             res.status(500).send({ 'err': error });
//         } else {
//             const productImage = data.Location;
//             res.status(200).send({ productImage });   
//         }    
//     });
// });

router.post('/imageUpload', upload.single('image'), (req, res) => {
    console.log(req);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ACL: 'public-read-write',
        ContentType: 'image/jpeg'
    };

    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send({ 'err': error });
        } else {
            const productImage = data.Location;
            res.status(200).send({ productImage });   
        }    
    });
});

router.get('/sss', (req, res) => {
    const sql = 'select * from questions where creator_id = "100271651231292935314"';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ 'err': err });
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    });
});

module.exports = s3;
module.exports = router;