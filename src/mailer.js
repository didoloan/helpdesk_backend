import nodemailer from 'nodemailer';

let details = {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: 'username',
       pass: 'password'
    }
};

let transport = nodemailer.createTransport(details);

transport.sendMail({
    from: 'noreply_helpdesk@lcc.com.ng',
    to: 'informationtechnology@lcc.com.ng',
    subject: 'SUBJECT',
    text: 'loremSit et in proident cupidatat magna qui commodo nulla tempor. Sunt ut pariatur non laborum consectetur officia. Aute duis eu proident exercitation dolore velit ut id aliquip culpa. Proident nulla labore cillum nisi sint pariatur ipsum reprehenderit. Sit aliquip sit ad do dolore amet amet culpa esse veniam.'
}, (err,info) => {
    if(err) {
        console.log(err);
    }else{
        console.log(info);
    }
});