const fs = require('fs')
const path = require('path')
const nexe = require('nexe')

function getFileExtension (exptype) {
  if (exptype === 'webjs' || exptype === 'js' || exptype === 'javascript') {
    return 'js'
  } else if (exptype === 'py' || exptype === 'python') {
    return 'py'
  } else if (exptype === 'web' || exptype === 'htm' || exptype === 'html' || exptype === 'website' || exptype === 'webpage') {
    return 'html'
  } else if (exptype === 'application' || exptype === 'exe' || exptype === 'exec' || exptype === 'executable') {
    return '__logicapplication__'
  } else {
    return 'js'
  }
}

function exportFun (c, f, exportpath, fname, extensionf) {
  if (f.endsWith('.__logicapplication__')) {
    const folder = path.join(exportpath, fname)
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
    fs.writeFileSync(path.join(folder, fname + '.js'), c)
    // nexe.compile() here
  } else {
    fs.writeFileSync(f, c)
  }
}

module.exports = {
  getFileExtension,
  exportFun
}
