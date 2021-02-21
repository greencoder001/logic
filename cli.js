const path = require('path')
const { getFileExtension, exportFun } = require('./logicExport.js')
const { compile } = require('./logicCompiler.js')
const argv = process.argv.slice(2)

if (argv.length < 2) {
  console.error('ERROR use: logic [file] [export-type]')
  process.exit(1)
}

const file = argv[0]
const export_type = argv[1]
const __path = process.cwd()
const filepath = path.join(__path, file).replace(/\\/g, '/')
const exportpath = ''
const fname = ''

console.log(filepath)
