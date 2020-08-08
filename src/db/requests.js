let requests

export default class User {
    static async injectDB(conn) {
        try{
            requests = await conn.db(process.env.ROSTER_NS).collection("users");

        } catch(e) {
            console.error(`Unable to establish connection to users collection: ${e}`);
        }
    }
}