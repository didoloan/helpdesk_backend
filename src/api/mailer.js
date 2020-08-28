

let details = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
       user: 'noreply.lcchelpdesk@gmail.com',
       pass: 'Lccadmin4it'
    }
};

let transport = nodemailer.createTransport(details);

process.on('message', (msg) => {
    transport.sendMail({
        from: 'noreply_helpdesk@lcc.com.ng',
        to: 'informationtechnology@lcc.com.ng',
        subject: 'REQUEST FOR SUPPORT',
        text: msg
    }, (err,info) => {
        if(err) {
            process.send({error:err})
        }else{
            process.send({message:info});
        }
    });
});

process.exit();





