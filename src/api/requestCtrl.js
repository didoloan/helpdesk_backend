import requestDbOps from '../db/requests';
import { ObjectId } from 'mongodb';

export default class requestCtrl{
    static async getWithHistory(req, res) {
        let response = requestDbOps.getWithHistory()
        if(response.error){
            res.json({error: 'Problem establishing connection with database.'});
            return;
        }
        res.json(response);
    }

    static async add(req, res) {
        let response = await requestDbOps.add({title:req.body.title, request_type:req.body.type, date_opened: new Date(), target_dept:req.body.target_dept, description:req.body.description, status:'open', comments:req.body.comment});
        if(response.insertedCount!=1){
            res.json({error:'DB error!'});
            return;
        }
        res.json({message:'Request posted successfully!'});
    }

    static async update(req, res) {
        let response = await requestDbOps.update({user_id:ObjectId(req.body.user_id), feedback: req.body.feedback, time_taken: req.body.time_taken, comment: req.body.comment});
        if(response.insertedCount!=1){
            res.json({error:'DB error'});
            return;
        }
        res.json({message: 'Update to request added successfully!'});
    }
}