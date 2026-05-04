const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const checklogSchema=new Schema({
    passId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Pass',
    },
    visitorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Visitor',
    },
    action:{
        type:String,
        enum:['checkin','checkout'],
        required:true,
    },
    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    note:{
        type:String,
    },
    timestamp:{
        type:Date,
        default:Date.now,
    },
})

module.exports=mongoose.model('Checklog', checklogSchema);