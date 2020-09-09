import { ObjectID, ObjectId } from 'mongodb';
import { response, request } from 'express';

let requests;
let updates;

export default class Requests {
    static async injectDB(conn) {
        try{
            requests = await conn.db(process.env.HELPDESK_DB).collection("requests");
            updates = await conn.db(process.env.HELPDESK_DB).collection("updates");
        } catch(e) {
            console.error(`Unable to establish connection to users collection: ${e}`);
        }
    }

    static async add(request) {
        let response;
        try {
            response = await requests.insertOne({...request});
            return response;
        } catch (e) {
            return {error: e};
        }
    }

    static async update(update) {
        let response;
        try {
            response = await updates.insertOne({...update});
            return response;
        } catch (e) {
            return {error:e};
        }
    }

    static async close(id) {
        let response;
        try {
            response = await requests.updateOne({_id: id}, {status:{$set:'closed'}});
            return response;
        } catch (e) {
            return {error: e};
        }
    }

    static async getWithHistory(id) {
        let response;
        try {
            response = await requests.aggregate([{$match:{_id: ObjectId(id)}}, {$lookup: {from: 'updates', localField: 'request_id', foreignField: '_id', as:'history'}}]);
            return response.toArray();
        } catch (e) {
            return {error:e};
        }
    }

    static async getupdates(id) {
        let response;
        try {
            response = await updates.find({request_id:id});
            return response.toArray();
        } catch (e) {
            return {error:e}
        }
    }

}