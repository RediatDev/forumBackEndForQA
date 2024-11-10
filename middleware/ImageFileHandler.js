// const multer = require('multer');


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './ImageStore');
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}_${file.originalname}`);
//     }
// });


// const fileChecker = function (req, file, cb) {
//     const allowedMimetypes = ['image/jpeg', 'image/png'];
    
    
//     if (!allowedMimetypes.includes(file.mimetype)) {
//         req.fileValidationError = 'Only .png and .jpeg format allowed!';  
//         return cb(null, false); 
//     }
    
    
//     cb(null, true);
// };


// const ImageFileUploader = multer({
//     storage: storage,   
//     fileFilter: fileChecker 
// });

// module.exports = ImageFileUploader;

const multer = require('multer');


// Memory storage to temporarily hold the file in memory
const storage = multer.memoryStorage();

const fileChecker = function (req, file, cb) {
    const allowedMimetypes = ['image/jpeg', 'image/png'];
    
    if (!allowedMimetypes.includes(file.mimetype)) {
        req.fileValidationError = 'Only .png and .jpeg format allowed!';
        return cb(null, false);
    }
    
    cb(null, true);
};

const ImageFileUploader = multer({
    storage: storage, 
    fileFilter: fileChecker
});

module.exports = ImageFileUploader;
