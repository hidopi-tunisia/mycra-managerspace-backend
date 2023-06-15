const fs = require('fs')
const multer = require('multer');
const store = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync('./uploads/')) {
        fs.mkdirSync(`./uploads/`, {
          recursive: true
        });
      }
      cb(null, `uploads/`)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
  
  })

const upload = multer({
    storage: store,
    fileFilter: function(req, file , callback){
        if(file.mimetype=="file/doc" || file.mimetype=="file/pdf" || file.mimetype=="file/docx" || file.mimetype=="file/rtf" ){
            callback(null,true)
        } else{
            console.log('Formats acceptées: docx, doc, rtf, pdf 500 ko max.')
            callback(null, false)
        }
    },
    limits:{
        fileSize: 1024 * 1024 * 500
    }
})