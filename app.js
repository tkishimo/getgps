const express = require('express');
const app = express();
const path = require('path');
app.use(express.static('public')); // publicディレクトリ内の静的ファイルを提供
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const pool = require('./DBConfig.js');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/api/items', async(req, res) => {
    res.send('Sending a list of items from the DB ...') 
})

app.get('/api/location', async function(req, res, next) {
    const userId    = req.query.userId;
    const latitude  = req.query.latitude;
    const longitude = req.query.longitude;
    let currentTimestamp = req.query.timestamp;

    // もしAPI呼び出し時に日時が渡されていればそれを使用
    if (!currentTimestamp) {
        currentTimestamp = new Date().toISOString();
    }

    console.log(userId);
    console.log([userId, longitude, latitude, currentTimestamp]);

    const query = 'insert into get_location values(nextval(\'serial\'),$1,st_setSRID(ST_Point($2,$3),4326),$4)';
    console.log(query);

    // パラメータを含む配列を使ってクエリを実行
    await pool.query(query, [userId, longitude, latitude, currentTimestamp]);

    // 応答を返す
    res.send('Location data inserted successfully.');
});

app.get('/api/token', async function(req, res, next) {
    const userId    = req.query.userId;
    const token     = req.query.token;
    let currentTimestamp = req.query.timestamp;

    // もしAPI呼び出し時に日時が渡されていればそれを使用
    if (!currentTimestamp) {
        currentTimestamp = new Date().toISOString();
    }

    const query = 'insert into id_token values($1,$2,$3) on conflict(userid) do update set token=$2, timestamp=$3;';
    console.log(query);

    // パラメータを含む配列を使ってクエリを実行
    await pool.query(query, [userId, token, currentTimestamp]);

    // 応答を返す
    res.send('token data upserted successfully.');
});

app.get('/api/sGMail', async function(req, res, next) {
    const toName    = req.query.toName;
    const toEmail   = req.query.toEmail;
    const fromEmail = req.query.fromEmail;
    const subject  = req.query.subject;
    const mailText = req.query.mailText;
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);    

    // 送信者、宛先、件名、メッセージ本文を指定
    const msg = {};
    const toMail = {};
    toMail.name = toName;
    toMail.email = toEmail;
    msg.to = toMail;
    msg.from = fromEmail;
    msg.subject = subject;
    msg.text = mailText;
    console.log(msg);
    // SendGrid APIを使用してメールを送信
    sgMail.send(msg)
    .then(() => {
        res.send('Email sent successfully via sGMail');
    })
    .catch((error) => {
        res.send('Error sending emal:', error);
    });
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
})