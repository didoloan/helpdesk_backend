import requestDbOps from '../db/requests';
import Coder from './coder';
import { ObjectId } from 'mongodb';
// import { fork } from 'child_process';
import { wss } from '../server';
const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);



const [IT_REQ_TYPES, FACILITY_REQ_TYPES] = [
    ['system', 'internet', 'printer', 'login', 'mail', 'software', 'vaaan'],
    ['furniture', 'appliances', 'fittings', 'power']
]

export default class requestCtrl {
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

        res.json({...response});
    }

    static async getUpdates(req, res){
        if(!req.get('Authorization')){
            res.json({error:'Not Authorized!'});
            return;
        }

        let token = req.get('Authorization').split(" ")[1];

        let userfromtoken = await Coder.jwtDecode(token);

        let response = await requestDbOps.getupdates(req.body.id);

        res.json({updates:response});
    }

    static async add(req, res) {
        if(['IT', 'FACILITY'].includes(req.body.target_dept)){
            switch (req.body.target_dept) {
                case 'IT':
                    if(!(IT_REQ_TYPES.includes(req.body.type))){
                        res.json({error: 'Invalid request type'});
                        return;
                    }
                    break;
                case 'FACILITY':
                    if(!(FACILITY_REQ_TYPES.includes(req.body.type))){
                        res.json({error: 'Invalid request type'});
                        return;
                    }
                    break;
                
                default:
                    break;
            }   
        }else{
            res.json({error: 'Invalid department!'});
            return;
        }      
        
        if(!req.get('Authorization')){
            res.json({error:'Not authorized'});
            return;
        }
        let token = req.get('Authorization').split(" ")[1];
        let userfromtoken = await Coder.jwtDecode(token);
        
        let response = await requestDbOps.add({plaza: req.body.plaza, request_type:req.body.type, date_opened: new Date(), request_dept: req.body.dept, target_dept:req.body.target_dept, description:req.body.description, status:'open'});
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
            const request = await mailjet
            .post("send", {'version': 'v3.1'})
            .request({
                "Messages":[{
                    "From": {
                        "Email": 'helpdesk.Noreply@lcc.com.ng',
                        "Name": "Noreply Helpdesk"
                    },
                    "To": [{
                        "Email": "informationtechnology@lcc.com.ng",
                        "Name": "Information Technology"
                    }],
                    "Subject": "REQUEST FOR SUPPORT",
                    "HTMLPart": `<h3>Hi Team,</h3><p>Assistance is needed  with a ${req.body.type} at ${req.body.plaza}.</p><p>Additional message: ${req.body.description}.</p>`
                }]
            })

            console.log(request.body);
            res.json({message:'Request posted successfully!', id: response.insertedId});
        } catch (error) {
            console.log(error);
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
        let response = await requestDbOps.update({attended_by: req.body.email, request_id: req.body.request_id, feedback: req.body.feedback, time_taken: req.body.time_taken, comment: req.body.comment});
        if(response.insertedCount!==1){
            res.json({error:'DB error'});
            return;
        }
        res.json({message: 'Update to request added successfully!'});
    }
}