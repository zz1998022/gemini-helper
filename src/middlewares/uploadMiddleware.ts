import fs from 'fs'
import path from 'path'

import multer from 'multer'

// 设置上传文件存储路径
const uploadDir = path.join(__dirname, '../', 'uploads')

// 如果目录不存在则创建
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir) // 文件保存路径
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext) // 自定义文件名
  },
})

// 文件大小限制等可选
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB

export default upload
