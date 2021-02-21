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

}

module.exports = {
  getFileExtension,
  exportFun
}
