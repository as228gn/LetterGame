import multer from 'multer'

// Konfigurera multer för att spara uppladdade filer i en mapp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

export const upload = multer({ storage })
