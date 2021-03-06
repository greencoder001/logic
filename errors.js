class LGPImportError extends Error {
  constructor (pkgname) {
    super(`LGP: Can't find Package ${pkgname}`)
    this.name = 'LGPImportError'
  }

  str () {
    return `print("${this.message}")
exit(ERR_EXIT_CODE)`
  }

  throwLog () {
    console.log(`${this.name}: ${this.message}`)
  }
}

class LGPInvalidPkgError extends Error {
  constructor (pkgname) {
    super(`LGP: Invalid Package ${pkgname}`)
    this.name = 'LGPInvalidPkgError'
  }

  str () {
    return `print("${this.message}")
exit(ERR_EXIT_CODE)`
  }

  throwLog () {
    console.log(`${this.name}: ${this.message}`)
  }
}

module.exports = { LGPImportError, LGPInvalidPkgError }
