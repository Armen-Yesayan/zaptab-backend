const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");
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

module.exports = {
    transporter,
    handlebarOptions
}
