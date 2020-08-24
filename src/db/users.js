let users

export default class User {
    static async injectDB(conn) {
        try{
            users = await conn.db(process.env.HELPDESK_DB).collection("users");
        } catch(e) {
            console.error(`Unable to establish connection to users collection: ${e}`);
        }
    }

    static async findOne(email) {
        try {
            let response = await users.findOne({email:email});
            return response;
        } catch (e) {
            return {error:e}
        }
    }

    static async create(user) {
        try {
            let response = await users.insertOne({...user});
            return response;
        } catch (e) {
            return {error: e}
        }
    }

}