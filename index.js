const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const uuid = require('uuid');
const hbs = require('nodemailer-express-handlebars');

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use('/uploads', express.static(__dirname + '/uploads'));

const port = process.env.PORT || 5000;

app.post('/api/send', async (req, res) => {
    const {name, phone, message} = req.body;

    if (message.details.length) {
        message.details.map(item => {
            if (item.images.length) {
                item.images.map(image => {
                    if (image.base64) {
                        let id = uuid.v4();
                        let fileName = __dirname + `/uploads/image-${id}.jpg`;
                        image.fileName = fileName;
                        let base64Data = image.base64.url.replace(`data:${image.base64.type};base64,`, "");

                        require("fs").writeFile(fileName, base64Data, 'base64', function (err) {
                            console.log(err);
                        });
                    }
                })
            }
        })
    }

    if (message.photoSts) {
        message.photoSts.map(item => {
            if(item.base64) {
                let id = uuid.v4();
                let fileName = __dirname + `/uploads/image-${id}.jpg`;
                item.fileName = fileName;
                let base64Data = item.base64.url.replace(`data:${item.base64.type};base64,`, "");

                require("fs").writeFile(fileName, base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
        })
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'testyantest14@gmail.com',
            pass: '159753tt',
        },
    });

    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/'),
    };

    transporter.use('compile', hbs(handlebarOptions))

    let mailOptions = {
        from: "Client support <armeny56@gmail.com>",
        to: 'egsiolgo@gmail.com',
        subject: 'New message from ZapTab.ru',
        template: 'email',
        context: {
            name,
            phone,
            message,
        },
        attachments: [],
    };

    if (message.details.length) {
        message.details.map(item => {
            if (item.images.length) {
                item.images.map(image => {
                    mailOptions.attachments.push({
                        filename: image.fileName,
                        path: image.fileName,
                        cid: image.fileName
                    })
                })
            }
        })
    }

    if (message.photoSts) {
        message.photoSts.map(item => {
            mailOptions.attachments.push({
                filename: item.fileName,
                path: item.fileName,
                cid: item.fileName
            })
        })
    }


    const send1 = await transporter.sendMail(mailOptions);
    mailOptions.to = 'zagirov.azamat@gmail.com';
    const send2 = await transporter.sendMail(mailOptions);

    if (send1 && send2) {
        res.json({status: 'success'});
    } else {
        res.json({status: 'error', message: 'Internal Server Error'})
    }
})

app.get('/', (req, res) => {
    res.send('working');
})

app.listen(port, () => {
    console.log('Server started in 5000 PORT')
})
