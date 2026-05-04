const multer = require('multer');
const path = require('path');

// where to save the file and what to name it
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // example: photo-1714900000000.jpg
        cb(null, 'photo-' + Date.now() + path.extname(file.originalname));
    }
});

// only allow image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;