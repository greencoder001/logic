
/* Start LGP Package: logic */
undefined
var ERR_EXIT_CODE = 1


/* End LGP Package: logic */
/* @END_OF_THIS_PKG; */

var print=console.log;

var random={int:function(min,max){return Math.floor(Math.random()*(max-min)+min)},bit:function(){return Math.round(Math.random())},cryptobit:function(){var c=parseInt(crypto.getRandomValues(new Uint32Array(1))[0].toString()[0]);if(c>=5){return 1}else{return 0}}};

print("LGP: Can't find Package gui")
exit(ERR_EXIT_CODE)

/* Start LGP Package: lgptest */
undefined
print('LGP is working!')

/* End LGP Package: lgptest */
/* @END_OF_THIS_PKG; */

print("LGP: Can't find Package tracking")
exit(ERR_EXIT_CODE)

print('Hello World')

var tCount = 0
var fCount = 0

repeat 100:
if random.bit() == 1:
tCount += 1
else:
fCount += 1

print(`${fCount}x 0`)
print(`${tCount}x 1`)

var win = new Window()
win.on('ready', -> {
win.setTitle('Example')
win.setDir('ltr')
win.setLang(track().language)
win.body.set(`
<h1>Example</h1>
`)
win.$('h1').set(win.$('h1').get() + ' <i>(Edited)</i>')
})

/* @endfile; */
