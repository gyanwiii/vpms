const User=require('../models/User');
const jwt=require('jsonwebtoken');

const requireAuth= async(req,res,next) =>{
    // verify authentication
    const {authorization}= req.headers;
    if(!authorization){
        return res.status(401).json({error:"Authentication token required"})
    }
    // Bearer token
    const token = authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({error:"Invalid authentication token"})
    }
    try {
        const {_id}=jwt.verify(token,process.env.SECRET_KEY)
        req.user=await User.findOne({_id}).select('-password');
        next();
    }
    catch(err){
        return res.status(401).json({error:"Invalid authentication token"})
    }
}

//To allow access to specific roles
const allowRoles=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({error:"Permission denied"});
        }
        next();
    };
};

module.exports={requireAuth,allowRoles};