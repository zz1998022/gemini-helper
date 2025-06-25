// src/controllers/gemini/UploadController.ts

import { Request, Response } from 'express'

import uploadService from '@svcs/gemini/UploadService'

import appStatus from '../../utils/appStatus'
import ResponseModel from '../../utils/response'

class UploadController {
  public uploadFile(req: Request, res: Response): void {
    const userId = req.body.id
    const file = req.file

    if (!userId || !file) {
      res.json(
        ResponseModel.error(
          appStatus.PARAM_ERROR.code,
          '缺少必要参数 id 或 file',
        ),
      )
      return
    }

    const filePath = uploadService.saveFile(userId, file.filename)

    res.json(
      ResponseModel.success({
        userId,
        originalName: file.originalname,
        savedName: file.filename,
        path: filePath,
        size: file.size,
      }),
    )
  }
}

export default new UploadController()
