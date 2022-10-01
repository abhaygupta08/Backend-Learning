const express = require('express');
const { CheckMail } = require('./util/CheckMail');
const { CheckMailBulk } = require('./util/CheckMailBulk')
const app = express();
const fs = require('fs')

const PORT = process.env.port || 8080

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }).single('em');

app.get('/verify',async (req, res) => {
    const { email } = req.query

    if (!email) return res.send({ success: false, status: '<span style=\"font-weight: bold;color: #131313;\">No email provided</span>', email })
    const status = await CheckMail(email)
    if (status === "") return res.send({ success: false, status: "<span style=\"font-weight: bold;color: #131313;\">Can not validate this email, Try again</span>", email })
    res.send({ success: true, status, email })
})

app.post('/verify', async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).send("Something went wrong!");
        }
        const FileData = fs.readFileSync(req.file.path, 'utf-8')
        // console.log(FileData)
        const status = await CheckMailBulk(FileData)
        // console.log(status)
        res.send({ success: true, status })
    });
})

app.listen(PORT, err => {
    if (err) throw err;
    console.log(`[APP RUNNING] : PORT - ${PORT}`)
})