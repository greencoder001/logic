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

exportFun(compile(filepath, exportpath, fname, exportType), exppath, exportpath, fname, getFileExtension(exportType))
console.log('Successfully exported')
