const qrcode=require('qrcode');
const Pass=require('../models/Pass');
const CheckLog=require('../models/Checklog');
const Visitor=require('../models/Visitor');
const {generatePDF} = require('./pdfGenerator');

// Create a new pass for an approved visitor
const createPass = async (req, res) => {
    try{
        const {visitorId,validDate} = req.body;
        const visitor = await Visitor.findById(visitorId);
        if (!visitor) return res.status(404).json({ message: "Visitor is not found" });
        if (visitor.status !== 'approved') {
            return res.status(400).json({ message: "Visitor should be approved first" });
        }
        // Generate unique pass number and QR code
        const passNo = 'PASS' + Date.now();
        const qrCode=await qrcode.toDataURL(passNo);
        const newPass = await Pass.create({visitorId,validDate,qrCode,passNo,issuedBy: req.user._id});
        
        // Generate PDF for the new pass
        const pdfPath = await generatePDF(newPass, visitor);
        
        res.status(201).json({ ...newPass._doc, pdfPath });
    }catch(error){
        res.status(400).json({message:error.message});
    }
};

// Get all passes
const getPasses = async (req, res) => {
    try{
        const passes = await Pass.find();
        res.status(200).json(passes);
    }catch(err){
        res.status(400).json({msg:err.message});
    }
};

// Get pass by ID
const getPassById = async (req, res) => {
    try {
        const passId = req.params.id;
        const pass = await Pass.findById(passId);
        if (!pass) {
            return res.status(404).json({ message: "Pass not found" });
        }
        res.status(200).json(pass);
    }catch(err){
        res.status(400).json({msg:err.message});
    }
};

// Check-in a visitor using their pass
const checkin = async (req, res) => {
    try {
        const updatedPass = await Pass.findByIdAndUpdate(req.params.id,{ checkedIn: true }, { new: true });
        if (!updatedPass) return res.status(404).json({ message: "Pass not found" });
        // Log the check-in action
        const checkLog = await CheckLog.create({ passId: updatedPass._id,visitorId: updatedPass.visitorId, action: 'checkin',performedBy: req.user._id });
        res.status(200).json(updatedPass);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// Check-out a visitor using their pass
const checkout = async (req, res) => {
    try {
        const updatedPass = await Pass.findByIdAndUpdate( req.params.id,{ checkedOut: true },{ new: true });
        if (!updatedPass) return res.status(404).json({ message: "Pass not found" });
        // Log the check-out action
        const checkLog = await CheckLog.create({ passId: updatedPass._id,visitorId: updatedPass.visitorId, action: 'checkout',performedBy: req.user._id });
        res.status(200).json(updatedPass);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// Revoke a pass
const revokePass = async (req, res) => {
    try {
        const updatedPass = await Pass.findByIdAndUpdate(req.params.id,{ status: 'revoked' },{ new: true });
        if (!updatedPass) return res.status(404).json({ message: "Pass not found" });
        res.status(200).json(updatedPass);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

module.exports = {createPass,getPasses,getPassById,checkin,checkout,revokePass};