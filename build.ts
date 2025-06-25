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
      start: 'cross-env NODE_ENV=prod node index.js',
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
 * 使用 tsc 构建 src 下所有 .ts 文件
 */
function runTsupBuild(): Promise<void> {
  const { exec } = require('child_process')
  return new Promise((resolve, reject) => {
    exec(
      'tsc --project tsconfig.json && tsc-alias -p tsconfig.json',
      (error: any, stdout: any) => {
        if (error) {
          console.error(`❌ 构建失败: ${error.message}`)
          return reject(error)
        }
        console.log(stdout)
        resolve()
      },
    )
  })
}

/**
 * 复制非代码资源（如 json、env）以及 public 文件夹和 Prisma client
 */
export async function copyAssets() {
  const ASSET_PATTERNS = ['src/**/*.json', 'src/**/*.env.dev']
  const PUBLIC_DIR = 'public'
  const ENV_FILES_PATTERN = '.env.*'

  // 1. 复制 public 文件夹
  try {
    const src = path.resolve(__dirname, PUBLIC_DIR)
    const dest = path.resolve(DIST_DIR, PUBLIC_DIR)
    await fse.copy(src, dest)
    console.log(`✅ 复制 public 文件夹`)
  } catch (err) {
    console.error(`❌ 复制 public 文件夹失败`, err)
    throw err
  }

  // 2. 复制所有 .env.* 文件
  try {
    const envFiles = await fg(ENV_FILES_PATTERN, { cwd: __dirname })
    for (const file of envFiles) {
      const srcPath = path.join(__dirname, file)
      const destPath = path.join(DIST_DIR, file)
      await fse.copy(srcPath, destPath)
      console.log(`✅ 复制 .env 文件: ${file}`)
    }
  } catch (err) {
    console.error(`❌ 复制 .env 文件失败`, err)
    throw err
  }

  // 3. 复制 JSON 和 ENV 文件
  for (const pattern of ASSET_PATTERNS) {
    try {
      const files = await globby(pattern)
      for (const file of files) {
        const relativePath = path.relative(path.resolve(__dirname, 'src'), file)
        const destPath = path.join(DIST_DIR, relativePath)
        await fse.ensureDir(path.dirname(destPath))
        await fse.copy(file, destPath)
        console.log(`✅ 复制文件: ${file}`)
      }
    } catch (err) {
      console.error(`❌ 复制文件失败: ${pattern}`, err)
      throw err
    }
  }

  // 4. ✅ 复制 Prisma client（整个目录）
  const prismaSrc = path.resolve(__dirname, './src/generated/prisma')
  const prismaDest = path.resolve(DIST_DIR, 'generated/prisma')

  try {
    await fse.copy(prismaSrc, prismaDest)
    console.log('✅ 复制 Prisma Client 到 dist/generated/prisma')
  } catch (err) {
    console.error('❌ 复制 Prisma Client 失败', err)
    throw err
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
