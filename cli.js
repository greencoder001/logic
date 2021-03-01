async function main () {
  const path = require('path')
  const { getFileExtension, exportFun } = require('./logicExport.js')
  const { compile } = require('./logicCompiler.js')
  const argv = process.argv.slice(2)

  if (argv.length < 2) {
    console.error('ERROR use: logic [file] [export-type]')
    process.exit(1)
  }

  const file = argv[0]
  const exportType = argv[1]
  const __path = process.cwd()
  const filepath = path.join(__path, file).replace(/\\/g, '/')
  const exportpath = path.dirname(filepath)
  const fname = path.basename(filepath, '.logic')
  const exppath = path.join(exportpath, fname + '.' + getFileExtension(exportType))

  try {
    exportFun(await compile(filepath, exportpath, fname, exportType, getFileExtension(exportType)), exppath, exportpath, fname, getFileExtension(exportType))
  } catch (err) {
    try {
      err.throwLog()
    } catch {
      console.error(err)
    }
    process.exit(1)
  }
  return `Successfully compiled ${fname}`
}

(async () => {
  try {
    var ret = await main()
    console.log(ret)
  } catch (err) {
    console.error(err)
  }
})()
