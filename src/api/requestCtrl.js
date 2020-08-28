import requestDbOps from '../db/requests';
import Coder from './coder';
import { ObjectId } from 'mongodb';
import { fork } from 'child_process';
const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);


export default class requestCtrl{
    static async getWithHistory(req, res) {
        if(!req.get('Authorization')){
            res.json({error:'Not Authorized!'});
            return;
        }

        let token = req.get('Authorization').split(" ")[1];

        let userfromtoken = await Coder.jwtDecode(token);

        let response = await requestDbOps.getWithHistory(ObjectId(req.body.id));

        if(response.error){
            res.json({error: 'Problem establishing connection with database.'});
            return;
        }

        res.json(...response);
    }

    static async add(req, res) {
        if(!req.get('Authorization')){
            res.json({error:'Not authorized'});
            return;
        }
        let token = req.get('Authorization').split(" ")[1];
        let userfromtoken = await Coder.jwtDecode(token);
        let response = await requestDbOps.add({title:req.body.title, plaza: req.body.plaza, request_type:req.body.type, date_opened: new Date(), target_dept:req.body.target_dept, description:req.body.description, status:'open', comments:req.body.comment});
        console.log(response.insertedId);
        if(response.insertedCount!==1){
            res.json({error:'DB error!'});
            if(userfromtoken.role==='technician'){
                res.json({error:'Not authorized'});
                return;
            }
            return;
        }
        
        try {
            // const request = await mailjet.post('send').request({
            //     FromEmail: 'noreply-helpdesk@lcc.com.ng',
            //     FromName: 'Helpdesk Noreply',
            //     Subject: 'REQUEST FOR SUPPORT',
            //     'Text-part':
            //     `Assistance is needed  with ${req.body.type} at ${req.body.plaza}. Additional message: ${req.body.description}.`,
            //     // 'Html-part':
            //     //   '<h3>Dear passenger, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!<br />May the delivery force be with you!',
            //     Recipients: [{ Email: 'informationtechnology@lcc.com.ng' }],
            // });

            const request = await mailjet
            .post("send", {'version': 'v3.1'})
            .request({
                "Messages":[{
                    "From": {
                        "Email": 'helpdesk.noreply@lcc.com.ng',
                        "Name": "Noreply Helpdesk"
                    },
                    "To": [{
                        "Email": "adedoyin.awosanya@lcc.com.ng",
                        "Name": "InformationTechnology"
                    }],
                    "Subject": "REQUEST FOR SUPPORT",
                    "HTMLPart": `<h3>Hi Team,</h3><p>Assistance is needed  with a ${req.body.type} at ${req.body.plaza}. Additional message: ${req.body.description}.</p>`
                }]
            })

            console.log(request.body);
            res.json({message:'Request posted successfully!', id: response.insertedId});
        } catch (error) {
            res.json({message:'Request posted successfully but email failed!', id: response.insertedId});
        }

    }

    static async update(req, res) {
        if(!req.get('Authorization')){
            res.json({error:'Not authorized'});
            return;
        }
        let token = req.get('Authorization').split(" ")[1];
        let userfromtoken = await Coder.jwtDecode(token);
        // if(userfromtoken.role!=='technician'){
        //     res.json({error:'Not authorized'});
        //     return;
        // }
        let response = await requestDbOps.update({user: req.body.email, request_id: req.body.request_id, feedback: req.body.feedback, time_taken: req.body.time_taken, comment: req.body.comment});
        if(response.insertedCount!==1){
            res.json({error:'DB error'});
            return;
        }
        res.json({message: 'Update to request added successfully!'});
    }
}