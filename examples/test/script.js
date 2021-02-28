var print=console.log;

var random={int:function(min,max){return Math.floor(Math.random()*(max-min)+min)},bit:function(){return Math.round(Math.random())},cryptobit:function(){var c=parseInt(crypto.getRandomValues(new Uint32Array(1))[0].toString()[0]);if(c>=5){return 1}else{return 0}}};

// import gui
undefined

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

// var win = new Window()
// win.load('./gui1', 7895)

/* @endfile; */
