import os

try:
  import pathlib
except ImportError:
  print("Trying to Install required module: pathlib\n")
  os.system('python -m pip install pathlib')

import sys
import pathlib
from lgexport import getfextension, export
from logiccompiler import compilelgs

if len(sys.argv) < 3:
    print('ERROR use: logic [file] [export-type]')
    sys.exit(-1)
file = sys.argv[1]
export_type = sys.argv[2]
path = pathlib.Path().absolute()
filepath = f'{path}/{file}'.replace('\\', '/')
exportpath = ''
fname = ''

i = 0
leng = len(filepath.split('/')) - 1
for pathtype in filepath.split('/'):
    if i < leng:
        exportpath += pathtype + '/'
    else:
        fname = ''
        j = 0
        lengt = len(pathtype.split('.')) - 1
        for n in pathtype.split('.'):
            if j < lengt:
                fname += n + '.'
            j += 1
    i += 1
exppath = exportpath + fname + getfextension(export_type)
export(compilelgs(filepath, exportpath, fname, export_type), exppath, exportpath, fname, getfextension(export_type))
print('Successfully exported')
