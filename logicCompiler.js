const fs = require('fs')
const path = require('path')
const { LGPImportError, LGPInvalidPkgError } = require('./errors.js')
const axios = require('axios')

const DefaultLGPIndex = 'lgp.greencoder001.repl.co'
const LGPIndex = (process.argv[4] === 'default' ? DefaultLGPIndex : process.argv[4]) || DefaultLGPIndex
/*
0: NODE_PATH
1: FILE
2: LOGIC_SCRIPT
3: LANGUAGE
4: LGPINDEX [OPTIONAL]
*/

async function getLgpPkg (pkname) {
  const err = new LGPInvalidPkgError(pkname)

  let response = null
  try {
    response = await axios.get(`https://${LGPIndex}/get/${encodeURIComponent(pkname)}`)
  } catch {
    err.throwLog()
    return err.str()
  }

  const data = response.data
  if (data && data.content && data.lang) {
    return `/* Start LGP Package: ${pkname} */\n${data.content}\n/* End LGP Package: ${pkname} */`
  } else {
    err.throwLog()
    return err.str()
  }
}

async function isLgpPkg (pkname) {
  let response = null
  try {
    response = await axios.get(`https://${LGPIndex}/get/${encodeURIComponent(pkname)}`)
  } catch {
    return false
  }
  const data = `${response.data}`.trim()
  if (data.startsWith('LGP_ERRROR:')) {
    return false
  } else {
    if (response.data && response.data.content && response.data.lang) {
      return true
    }
  }
  return false
}

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
  } else if (await isLgpPkg(pkgname.trim())) {
    return await getLgpPkg(pkgname.trim())
  } else {
    const err = new LGPImportError(pkgname.trim())
    err.throwLog()
    return err.str()
  }
}

async function compile (filepath, exportpath, fname, exportType, fex) {
  if (!fs.existsSync(path.join(exportpath, '__logic__'))) {
    fs.mkdirSync(path.join(exportpath, '__logic__'))
  }

  if (!fs.existsSync(path.join(exportpath, path.join('__logic__', fname)))) {
    fs.mkdirSync(path.join(exportpath, path.join('__logic__', fname)))
  }

  const content = fs.readFileSync(filepath).toString('utf8')
  const importLogic = !(content.includes('# NO_LOGIC_IMPORT;') || content.includes('#NO_LOGIC_IMPORT;'))

  let exported = ''
  let ifConditions = 0
  const linesall = content.split('\n')

  if (importLogic) {
    linesall.unshift('import logic')
  }

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

  return exported.replace(/#(.*?);/g, '/* #$1; */')
}

module.exports = {
  compile
}
