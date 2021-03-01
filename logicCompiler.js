const fs = require('fs')
const path = require('path')
const { LGPImportError, LGPInvalidPkgError, FileDoesntExistsError } = require('./errors.js')
const axios = require('axios')
const caching = require('./cache.js')
const chalk = require('chalk')

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

async function imppkg (expt, pkgname, pathdir4proj, fname) {
  const cfile = path.join(pathdir4proj, path.join('__logic__', path.join(fname, path.join('__modules__', 'cache.json'))))
  const pkpath = path.join(__dirname, path.join('pkg', path.join(expt, `${pkgname.trim()}.lgp`)))
  pkgname = pkgname.trim()
  if (pkgname.startsWith('lgp:')) {
    const realpkgname = pkgname.split('/')[pkgname.split('/').length - 1]
    console.log(realpkgname)
  } else if (fs.existsSync(path.join(pathdir4proj, `${pkgname}.logic`))) {
    return fs.readFileSync(path.join(pathdir4proj, `${pkgname}.logic`))
  } else if (fs.existsSync(path.join(pathdir4proj, `${pkgname}.lgp`))) {
    return fs.readFileSync(path.join(pathdir4proj, `${pkgname}.lgp`))
  } else if (fs.existsSync(path.join(pathdir4proj, `${pkgname}.lgs`))) {
    return fs.readFileSync(path.join(pathdir4proj, `${pkgname}.lgs`))
  } else if (fs.existsSync(pkpath)) {
    return fs.readFileSync(pkpath)
  } else if (await isLgpPkg(pkgname)) {
    // Compile Package
    const ctime = caching.ctime()
    const cache = JSON.parse(fs.readFileSync(cfile).toString('utf-8'))
    const needsToFetch = cache[pkgname] !== ctime
    if (needsToFetch) {
      console.log(chalk.keyword('orange')('[LGP] Fetching ' + pkgname))
      cache[pkgname] = ctime
      fs.writeFileSync(cfile, JSON.stringify(cache))
      const fetched = await getLgpPkg(pkgname)
      fs.writeFileSync(path.join(pathdir4proj, path.join('__logic__', path.join(fname, path.join('__modules__', `${pkgname}.lgp`)))), fetched)
      return fetched
    } else {
      return fs.readFileSync(path.join(pathdir4proj, path.join('__logic__', path.join(fname, path.join('__modules__', `${pkgname}.lgp`)))))
    }
  } else {
    const err = new LGPImportError(pkgname)
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
  if (!fs.existsSync(path.join(exportpath, path.join('__logic__', path.join(fname, '__modules__'))))) {
    fs.mkdirSync(path.join(exportpath, path.join('__logic__', path.join(fname, '__modules__'))))
  }
  if (!fs.existsSync(path.join(exportpath, path.join('__logic__', path.join(fname, path.join('__modules__', 'cache.json')))))) {
    fs.writeFileSync(path.join(exportpath, path.join('__logic__', path.join(fname, path.join('__modules__', 'cache.json')))), '{}')
  }

  var content

  try {
    content = fs.readFileSync(filepath).toString('utf8')
  } catch {
    throw new FileDoesntExistsError(filepath)
  }
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
      exported += await imppkg(exportType, pkgname, exportpath, fname) + '\n'
    } else if (withoutTabs.startsWith('if') && withoutTabs.endsWith(':') && (fex === 'js' || fex === '.__logicapplication__')) {
      const condition = withoutTabs.substr(3, withoutTabs.length - 4)
      console.log(condition)
      exported += 'if(' + condition + '){\n'
      ifConditions += 1
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
