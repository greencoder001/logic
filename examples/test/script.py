"""No print needed."""
import random as logicrandomhandler
def logicrandomrbit():
  return logicrandomhandler.randint(0,2)
random={"bit":logicrandomrbit,"cryptobit":logicrandomrbit,"int":logicrandomhandler.randint}
from time import sleep

print('Hello World')

var tCount = 0
var fCount = 0

for counter in range(0,100):
    if random.bit() == 1:
        tCount += 1
    else:
        fCount += 1

print(`${fCount}x 0`)
print(`${tCount}x 1`)

while 1:
    sleep(3)
    print('INFINITY IS GREAT')
