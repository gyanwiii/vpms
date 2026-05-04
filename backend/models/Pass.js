const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const passSchema=new Schema({
    visitorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Visitor',
    },
    passNo:{
        type:String,
        required:true,
        unique:true,
    },
    qrCode:{
        type:String,
    },
    pdfPath:{
        type:String,
    },
    status:{
        type:String,
        enum:['active','expired','revoked'],
        default:'active',
    },
    checkedIn:{
        type:Boolean,
        default:false,
    },
    checkedOut:{
        type:Boolean,
        default:false,
    },
    validDate:{
        type:Date,
        required:true,
    },
    issuedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{timestamps:true});

module.exports=mongoose.model('Pass',passSchema);