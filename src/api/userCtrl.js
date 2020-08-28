import Coder from './coder';
import UserDbOps from '../db/users';

export default class userCtrl{
    static async login(req, res) {
        let exists = await UserDbOps.findOne(req.body.email);
        if(!exists) {
            res.json({error: "Auth failed!"});
            return;
        }
        let passwordIsSame = await Coder.compare(req.body.password, exists.password);
        // console.log(passwordIsSame);
        if(passwordIsSame) {
            let token = await Coder.jwtEncode({id:exists._id, name: exists.name, email: exists.email, role: exists.role});
            res.json({auth_token: token, user: {name: exists.name, email: exists.email, role:exists.role}});
            return;
        }
        res.json({error: "Auth failed!"});
        return;
    }

    static async register(req, res) {
        console.log('in register');
        console.log(req.body);
        let domain = req.body.email.split('@')[1];
        if(domain!=='lcc.com.ng'){
            res.json({error:"Unauthorized email"});
        }

        let exists = await UserDbOps.findOne(req.body.email);
        if(exists) {
            res.json({error:'Account creation failed!'});
            return;
        }
        let response = await UserDbOps.create({
            email: req.body.email,
            name: req.body.name,
            dept: req.body.dept,
            role: req.body.role,
            password: await Coder.hash(req.body.password)
        });
        if(response.error){
            res.json({error: 'Account creation failed!'});
        }
        if(response.insertedCount==1){
            res.json({message: 'Account created successfully!'});
        }
    }
}