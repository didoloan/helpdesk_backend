let users

export default class User {
    static async injectDB(conn) {
        try{
            users = await conn.db(process.env.ROSTER_NS).collection("users");

        } catch(e) {
            console.error(`Unable to establish connection to users collection: ${e}`);
        }
    }
}