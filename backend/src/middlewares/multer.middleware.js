import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename) // stores path till middlewares folder

const storage = multer.diskStorage(
    {
        destination: function(req, file, cb) {
            const uploadPath = path.join(_dirname, "../../public/temp")
            cb(null, uploadPath) // 'null (no) error' & destination path is 'uploadPath'
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname) // adding date of upload to prevent conflict if multiple files have same name
        }
    }
)

export const upload = multer({ storage })