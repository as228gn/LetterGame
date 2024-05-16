import multer from 'multer'

// Konfigurera multer för att spara uppladdade filer i en mapp
const storage = multer.diskStorage({
  /**
   * Destination.
   *
   * @param {object} req - Express request object.
   * @param {object} file - file
   * @param {object} cb - cb
   */
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  /**
   * Filename.
   *
   * @param {object} req - Express request object.
   * @param {object} file - file
   * @param {object} cb - cb
   */
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

export const upload = multer({ storage })
