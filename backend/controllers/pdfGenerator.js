//pdfkit for generating pdfs, fs for file handling, path for handling file paths
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Function to generate PDF for a visitor pass
const generatePDF = async (pass, visitor) => {
    // create uploads/badges folder if it doesn't exist
    const dir = path.join(__dirname, '../uploads/badges');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // create unique filename for the PDF
    const filename = `badge-${pass.passNo}.pdf`;
    const filepath = path.join(dir, filename);

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: [300, 400], margin: 20 });
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // title
        doc.fontSize(20).font('Helvetica-Bold').text('VISITOR PASS', { align: 'center' });
        doc.moveDown();

        // pass number
        doc.fontSize(12).font('Helvetica').text(`Pass No: ${pass.passNo}`, { align: 'center' });
        doc.moveDown();

        // visitor details
        doc.fontSize(12).text(`Name: ${visitor.name}`);
        doc.text(`Purpose: ${visitor.purpose}`);
        doc.text(`Company: ${visitor.company}`);
        doc.moveDown();

        // valid date
        doc.text(`Valid Until: ${new Date(pass.validDate).toLocaleDateString()}`);
        doc.moveDown();

        doc.end();

        stream.on('finish', () => resolve(filepath));
        stream.on('error', reject);
    });
};

module.exports = { generatePDF };