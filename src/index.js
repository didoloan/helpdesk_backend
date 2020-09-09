import { MongoClient } from 'mongodb';
import server from './server';
import UserDB from './db/users';
import RequestDB from './db/requests';

MongoClient.connect(process.env.HELPDESK_NS, {
    poolSize:50, 
    useNewUrlParser:true, 
    useUnifiedTopology: true
})
.catch(err => {
    console.error(err.stack);
    process.exit(1);
})
.then(async client => {
    await UserDB.injectDB(client);
    await RequestDB.injectDB(client);
    // server.listen(5660);
    server.listen(5660, () => {
        console.log(`Server listening on port 5660 at ${new Date()}.`);
    });
})

