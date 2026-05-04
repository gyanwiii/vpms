const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema=new Schema({
    visitorName:{
        type:String,
        required:true,
    },
    visitorEmail:{
        type:String,
        required:true,
    },
    visitorPhone:{
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
    date:{
        type:Date,
        required:true,
    },
    hostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{timestamps:true});

module.exports=mongoose.model('Appointment',appointmentSchema);