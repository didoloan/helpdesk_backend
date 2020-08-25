import requestDbOps from '../db/requests';
import Coder from './coder';
import { ObjectId } from 'mongodb';



export default class requestCtrl{
    static async getWithHistory(req, res) {
        if(!req.get('Authorization')){
            res.json({error:'Not Authorized!'});
            return;
        }

        let token = req.get('Authorization').split(" ")[1];

        let userfromtoken = await Coder.jwtDecode(token);

        let response = requestDbOps.getWithHistory(req.body.id);

        if(response.error){
            res.json({error: 'Problem establishing connection with database.'});
            return;
        }

        res.json(response);
    }

    static async add(req, res) {
        if(!req.get('Authorization')){
            res.json({error:'Not authorized'});
            return;
        }
        let token = req.get('Authorization').split(" ")[1];
        let userfromtoken = await Coder.jwtDecode(token);
        if(userfromtoken.role==='technician'){
            res.json({error:'Not authorized'});
            return;
        }
        let response = await requestDbOps.add({title:req.body.title, request_type:req.body.type, date_opened: new Date(), target_dept:req.body.target_dept, description:req.body.description, status:'open', comments:req.body.comment});
        if(response.insertedCount!=1){
            res.json({error:'DB error!'});
            return;
        }
        res.json({message:'Request posted successfully!'});
    }

    static async update(req, res) {
        if(!req.get('Authorization')){
            res.json({error:'Not authorized'});
            return;
        }
        let token = req.get('Authorization').split(" ")[1];
        let userfromtoken = await Coder.jwtDecode(token);
        if(userfromtoken.role!=='technician'){
            res.json({error:'Not authorized'});
            return;
        }
        let response = await requestDbOps.update({user_id:ObjectId(req.body.user_id), feedback: req.body.feedback, time_taken: req.body.time_taken, comment: req.body.comment});
        if(response.insertedCount!=1){
            res.json({error:'DB error'});
            return;
        }
        res.json({message: 'Update to request added successfully!'});
    }
}