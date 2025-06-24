class UploadService {
  /**
   * 模拟文件保存逻辑
   * @param userId 用户ID
   * @param fileName 文件名
   * @returns 返回存储路径或其他信息
   */
  public saveFile(userId: string, fileName: string): string {
    // 这里你可以写入数据库、移动文件到指定目录等操作
    const filePath = `/uploads/${userId}/${fileName}`
    return filePath
  }
}

export default new UploadService()
