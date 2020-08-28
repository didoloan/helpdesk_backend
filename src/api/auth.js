import Coder from "./coder";
import UserDbOps from "../db/users";


export default class Auth {
    static async isAdmin(req, res, next) {
        let token = req.get("Authorization")?req.get("Authorization").split(' ')[1]:''
        let userFromToken = await Coder.jwtDecode(token);
        let user = await UserDbOps.findOne(Number(userFromToken.email));
        if(user.error){
            res.json(user)
            return
        }
        if (user.role!='admin'){
            res.json({error: "Not Authorized!"});
            return;
        }
        next();
    }

    static async isSupervisor(req, res, next) {
        let token = req.get("Authorization")?req.get("Authorization").split(' ')[1]:''
        let userFromToken = await Coder.jwtDecode(token);
        let user = await UserDbOps.findOne(Number(userFromToken.id));
        if(user.error){
            res.json(user);
            return;
        }
        if (user.role!='supervisor'){
            res.json({error: "Not Authorized!"});
            return;    
        }
        next();
    }

    static async isTechnician(req, res, next) {
        let token = req.get("Authorization")?req.get("Authorization").split(' ')[1]:''
        let userFromToken = await Coder.jwtDecode(token);
        let user = await UserDbOps.findOne(Number(userFromToken.id));
        if(user.error){
            res.json(user);
            return;
        }
        if (user.role!='technician'){
            res.json({error: "Not Authorized!"});
            return;
        }
        next();
    }

    static async isPowerUser(req,res,next) {
        let token = req.get("Authorization")?req.get("Authorization").split(' ')[1]:''
        let userFromToken = await Coder.jwtDecode(token);
        let user = await UserDbOps.findOne(Number(userFromToken.id));
        if(user.error){
            res.json(user)
            return
        }
        if (user.role!='poweruser'){
            res.json({error: "Not Authorized!"});
            return;
        }
        next();
    }

    static async isAuthenticated(req, res, next) {
        let token = req.get("Authorization")?req.get("Authorization").split(' ')[1]:''
        if(token=='') {
            res.json({error:'Not Authorized!'});
            return;
        }
        let userFromToken = await Coder.jwtDecode(token);
        let user = await UserDbOps.findOne(userFromToken.email);
        if(user.email != userFromToken.email) {
            res.json({error: "Not Authorized!"});
            return;
        }
        next();
    }
}
