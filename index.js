const express = require('express');
const cors = require('cors');
const transporter = require('./nodemailer').transporter;

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use('/uploads', express.static(__dirname + '/uploads'));

const port = process.env.PORT || 5000;

const sendEmail = async (message, template, res, id) => {
    let mailOptions = {
        from: "Client support <armeny56@gmail.com>",
        to: 'egsiolgo@gmail.com',
        subject: 'New message from ZapTab.ru',
        template,
        context: {
            message,
            id
        },
    };

    const send1 = await transporter.sendMail(mailOptions);
    mailOptions.to = 'zagirov.azamat@gmail.com';
    const send2 = await transporter.sendMail(mailOptions);

    if (send1 && send2) {
        res.json({status: 'success'});
    } else {
        res.json({status: 'error', message: 'Internal Server Error'})
    }
}

app.post('/api/send', async (req, res) => {
    const {message} = req.body;
    await sendEmail(message, 'email', res)
})

app.post('/api/call-me/:id', async (req, res) => {
    const {id} = req.params;
    const {message} = req.body;

    await sendEmail(message, 'call-me', res, id)
})

app.get('/', (req, res) => {
    res.send('working');
})

app.listen(port, () => {
    console.log('Server started in 5000 PORT')
})
