// const nodemailer = require('nodemailer');
// require('dotenv').config();
// const mail = async (email, title, body) => {
//     try {
//         let transpoter = nodemailer.createTransport({
//             host:process.env.MAIL_Host,
//             auth : {
//                 user : process.env.MAIL_USER,
//                 pass : process.env.MAIL_PASS
//             }
//         })

//         let info = await transporter.sendEmail({
//             from : "",
//             to : `${email}`,
//             subject : `${title}`, 
//             html : `${body}`,
//         } )

//         console.log(info);

//         return info
//     } catch (error) {
//         console.log(error)
        
//     }
// }

// module.exports = mail;

// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const mail = async (email, title, body) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             // port: 587,
//             // secure: false, // true for 465, false for other ports
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS
//             }
//         });

//         let info = await transporter.sendMail({
//             from: `"Your Name" <${process.env.MAIL_USER}>`, // sender address
//             to: email, // list of receivers
//             subject: title, // Subject line
//             html: body // html body
//         });

//         console.log('Message sent: %s', info.messageId);

//         return info;
//     } catch (error) {
//         console.log('Error sending email:', error);
//         throw error;
//     }
// };

// module.exports = mail;


const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587, // Port 587 for TLS
    secure: false, // Set to true if you use port 465
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const mail = async (to, subject, text) => {
    try {
        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: `${to}`,
            subject: `${subject}`,
            text: `${text}`,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error occurred while sending email: ', error);
        throw error;
    }
};

module.exports = { mail };
