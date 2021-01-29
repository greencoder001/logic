var print=console.log;
var random={int:function(min,max){return Math.floor(Math.random()*(max-min)+min)},bit:function(){return Math.round(Math.random())},cryptobit:function(){var c=parseInt(crypto.getRandomValues(new Uint32Array(1))[0].toString()[0]);if(c>=5){return 1}else{return 0}}};
var puppeteer = {}
var success = false

try {
  puppeteer = require('puppeteer')
  success = true
} catch {
  success = false
}

if (success) {
  var fs = require('fs')
  var http = require('http')
  var path = require('path')

  var troneeP = (data, port) => {
    var d = data

    var v = '0.0.1'

    return `
  <!-- Start Tronee required scripts -->
  <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/greencoder001/queryjs@latest/dist/query.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/greencoder001/async.js@latest/dist/bundle.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/greencoder001/zGET@latest/dist/bundle.js"></script>
  <!-- End Tronee required script -->
  <script>
    window.tronee = {
      version: '${v}',
      v: '${v}',
      port: ${port},
      quit: function () {
      }
    }
  </script>
  <!-- Content: -->
  ${d}`
  }

  class TroneeFileServer {
    constructor (dir, port) {
      this.dir = (function (d) {
        d = d.replace(/\\/g, '/')
        if (path.isAbsolute(d)) {
          return d
        } else {
          return path.join(path.parse(process.argv[1]).dir, d.startsWith('.') ? d.substr(1) : d)
        }
      })(dir)

      this.server = http.createServer((req, res) => {
        // var fRawName = `${(dir.replace(/\\/g, '/').endsWith('/') ? dir.substr(0, dir.length - 1) : dir).substr(1)}${req.url.split('?')[0]}`
        // var fr = path.join(process.cwd(), path.join(path.parse(dir).dir, fRawName))
        // var fName = fr.endsWith('/') ? fr + 'index.html' : fr
        //
        // console.log(fr)
        // console.log(process.argv)
        // console.log('---')

        var fName = path.parse(path.join(this.dir, req.url.split('?')[0])).ext === '' ? path.join(path.join(this.dir, req.url.split('?')[0]), 'index.html') : path.join(this.dir, req.url.split('?')[0])

        fs.readFile(fName, 'utf8', (err, data) => {
          console.log(fName)
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' })

            var fourHundredFourB = '<center><h1>404 Not Found</h1><hr />Tronee</center>'
            var fourHundredFour = ''

            try {
              fourHundredFour = troneeP(fs.readFileSync(`${dir.replace(/\\/g, '/').endsWith('/') ? dir.substr(0, dir.length - 1) : dir}/404.html`), port)
            } catch {
              fourHundredFour = fourHundredFourB
            }

            return res.end(fourHundredFour)
          }

          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.write(troneeP(data, port))
          res.end()
        })
      }).listen(parseInt(port))

      this.url = `http://127.0.0.1:${parseInt(port)}/`
    }
  }

  class TroneeApp {
    constructor (url) {
      this.url = url
      this.initBrowser()
    }

    async initBrowser () {
      this.browser = await puppeteer.launch({
        headless: false,
        args: [
          `--app=${this.url}`
        ]
      })
    }

    async close () {
      await this.browser.close()
    }
  }

  var Window = class Window {
    constructor () {
      this.window = true
    }

    load (dir, port) {
      this.server = new TroneeFileServer(dir, port)
      this.app = new TroneeApp(this.server)
    }
  }
  process.Window = Window
} else {
  console.log('Please execute "npm install -g puppeteer" and restart the program')
}

print('Hello World')

var tCount = 0
var fCount = 0

for(counter=0;counter<100;counter++){
if(random.bit() == 1){
tCount += 1
}else{
fCount += 1
}
}print(`${fCount}x 0`)
print(`${tCount}x 1`)

var win = new Window()
win.load('./gui1', 7895)
/*endfile*/
