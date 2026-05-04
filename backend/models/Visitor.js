const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const visitorSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    company:{
        type:String,
        required:true,
    },
    purpose:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending',
    },
    photo:{
        type:String,
    },
    hostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',

    }
},{timestamps:true});

module.exports=mongoose.model('Visitor',visitorSchema);