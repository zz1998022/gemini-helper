import fs from 'fs/promises'
import path from 'path'
import { pkgUp } from 'pkg-up'
import fse from 'fs-extra'
import { globby } from 'globby'
import fg from 'fast-glob'

const DIST_DIR = path.resolve(__dirname, 'dist')

/**
 * 精简 package.json 并写入 dist/
 */
async function writeSlimPackageJson() {
  const originalPkgPath = await pkgUp({ cwd: __dirname })
  if (!originalPkgPath) throw new Error('未找到 package.json')

  const rawPkg = JSON.parse(await fs.readFile(originalPkgPath, 'utf8'))

  const slimPkg = {
    name: rawPkg.name,
    version: rawPkg.version,
    description: rawPkg.description,
    main: 'index.js',
    scripts: {
      start: 'node index.js',
    },
    dependencies: rawPkg.dependencies || {},
    engines: rawPkg.engines,
    license: rawPkg.license || 'MIT',
  }

  const distPkgPath = path.join(DIST_DIR, 'package.json')
  await fs.writeFile(distPkgPath, JSON.stringify(slimPkg, null, 2), 'utf8')
  console.log(`✅ 写入 dist/package.json`)
}

/**
 * 使用 tsup 构建 src 下所有 .ts 文件
 */
function runTsupBuild(): Promise<void> {
  const { exec } = require('child_process')
  return new Promise((resolve, reject) => {
    exec('tsup src/**/*.ts', (error: any, stdout: any) => {
      if (error) {
        console.error(`❌ 构建失败: ${error.message}`)
        return reject(error)
      }
      console.log(stdout)
      resolve()
    })
  })
}

/**
 * 复制非代码资源（如 json、env）以及 public 文件夹
 */
async function copyAssets() {
  const ASSET_PATTERNS = ['src/**/*.json', 'src/**/*.env']
  const PUBLIC_DIR = 'public'
  const ENV_FILES_PATTERN = '.env*' // 匹配所有以 .env 开头的文件

  // 复制 public 文件夹到 dist 目录
  try {
    await fse.copy(
      path.join(__dirname, PUBLIC_DIR),
      path.join(DIST_DIR, PUBLIC_DIR),
    )
    console.log(`✅ 复制资源: ${PUBLIC_DIR}`)
  } catch (err) {
    console.error(`❌ 复制资源失败: ${PUBLIC_DIR}`, err)
    throw err // 抛出错误以便 main 函数捕获
  }

  // 复制所有 .env 文件到 dist 目录
  try {
    const envFiles = await fg(ENV_FILES_PATTERN, { cwd: __dirname })
    console.log(envFiles)

    for (const file of envFiles) {
      const srcPath = path.join(__dirname, file)
      const destPath = path.join(DIST_DIR, file)
      await fse.copy(srcPath, destPath)
      console.log(`✅ 复制资源: ${file}`)
    }
  } catch (err) {
    console.error(`❌ 复制资源失败: ${ENV_FILES_PATTERN}`, err)
    throw err // 抛出错误以便 main 函数捕获
  }

  // 复制其他资源文件
  for (const pattern of ASSET_PATTERNS) {
    try {
      // 使用 globby 来匹配文件并复制
      const files = await globby(pattern)

      for (const file of files) {
        const relativePath = path.relative(path.dirname(pattern), file)
        const destPath = path.join(DIST_DIR, relativePath)
        await fse.copy(file, destPath)
        console.log(`✅ 复制资源: ${file}`)
      }
    } catch (err) {
      console.error(`❌ 复制资源失败: ${pattern}`, err)
      throw err // 抛出错误以便 main 函数捕获
    }
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始构建项目...')

    // Step 1: 清空 dist
    await fs.rm(DIST_DIR, { recursive: true, force: true })
    await fs.mkdir(DIST_DIR, { recursive: true })

    // Step 2: 使用 tsup 构建
    await runTsupBuild()

    // Step 3: 复制资源文件
    await copyAssets()

    // Step 4: 写入精简版 package.json
    await writeSlimPackageJson()

    console.log(`🎉 构建完成！输出在${DIST_DIR}`)
  } catch (e) {
    console.error('❌ 构建过程中出错:', e)
    process.exit(1)
  }
}

main()
