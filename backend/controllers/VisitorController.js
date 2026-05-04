const Visitor=require('../models/Visitor');

const createVisitor=async(req,res)=>{
    try{
        const { name, email, phone, company, purpose } = req.body;
        const photo = req.file ? req.file.filename : null;
        const visitor = await Visitor.create({ name, email, phone, company, purpose, photo, hostId: req.user._id });
        res.status(201).json(visitor);
    }catch(error){
        res.status(400).json({message:error.message});
    }
};

const getVisitors=async(req,res)=>{
    try{
        const visitors=await Visitor.find();
        res.status(200).json(visitors);
    }catch(error){
        res.status(400).json({message:error.message});
    }
};

const getVisitorById=async(req,res)=>{
    try{
        const visitor=await Visitor.findById(req.params.id);
        if(!visitor){
            return res.status(404).json({message:'Visitor not found'});
        }
        res.status(200).json(visitor);
    }catch(error){
        res.status(400).json({message:error.message});
    }
};

const approveVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }
        res.status(200).json(visitor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const rejectVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }
        res.status(200).json(visitor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports={createVisitor,getVisitors,getVisitorById,approveVisitor,rejectVisitor};
