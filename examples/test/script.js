cli
random
weirdconcatting

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
win.load('./gui1', 7895)

/* @endfile; */
