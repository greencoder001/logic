const fs = require('fs')
const path = require('path')
const { LGPImportError } = require('./errors.js')

async function imppkg (expt, pkgname, pathdir4proj) {
  const pkpath = path.join(__dirname, path.join('pkg', path.join(expt, `${pkgname.trim()}.lgp`)))
  if (fs.existsSync(path.join(pathdir4proj, `${pkgname}.logic`))) {
    return fs.readFileSync(path.join(pathdir4proj, `${pkgname.trim()}.logic`))
  } else if (fs.existsSync(path.join(pathdir4proj, `${pkgname.trim()}.lgp`))) {
    return fs.readFileSync(path.join(pathdir4proj, `${pkgname.trim()}.lgp`))
  } else if (fs.existsSync(path.join(pathdir4proj, `${pkgname.trim()}.lgs`))) {
    return fs.readFileSync(path.join(pathdir4proj, `${pkgname.trim()}.lgs`))
  } else if (fs.existsSync(pkpath)) {
    return fs.readFileSync(pkpath)
  } else {
    const err = new LGPImportError(pkgname.trim())
    err.throwLog()
    return err.str()
  }
}

async function compile (filepath, exportpath, fname, exportType, fex) {
  const content = fs.readFileSync(filepath).toString('utf8')

  let exported = ''
  let ifConditions = 0
  const linesall = content.split('\n')

  if (fex === 'js' || fex === '.__logicapplication__') {
    linesall.push('/* @endfile; */')
  }

  for (let line of linesall) {
    const trimmed = line.trim()
    const withoutTabs = line.replace(/\t/g, '').replace(/ {2}/g, '')

    if (trimmed.startsWith('import ')) {
      const pkgname = withoutTabs.substr(7)
      exported += await imppkg(exportType, pkgname, exportpath) + '\n'
    } else {
      let tabcount = 0
      const lb = line
      while (line.includes('  ') || line.includes('\t')) {
        tabcount += 1
        line = line.includes('  ') ? line.replace('  ', '') : line.replace('\t', '')
      }
      let suffix = ''
      if (tabcount < ifConditions && (fex !== 'py')) {
        suffix = '}'
        ifConditions -= 1
      }

      if (exportType === 'py' || exportType === 'python') {
        exported += lb + '\n' + suffix
      } else {
        exported += line + '\n' + suffix
      }
    }
  }

  return exported
}

module.exports = {
  compile
}
