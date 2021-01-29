import os

def getfextension(exptype):
    if exptype == 'webjs':
        return 'js'
    elif exptype == 'py' or exptype == 'python':
        return 'py'
    elif exptype == 'application':
        return 'logicapplication'
    else:
        return 'js'

def export(c, f, exportpath, fname, extensionf):
    if f.endswith('.logicapplication'):
        try:
            os.mkdir(exportpath + fname[:-1])
        except:
            pass
        fi = open((exportpath + fname[:-1] + '/' + fname + extensionf).replace('.logicapplication', '.app.js'), 'w', encoding = 'utf-8')
        fi.write(c)
        fi.close()
        fi = open((exportpath + fname[:-1] + '/' + fname + extensionf).replace('.logicapplication', '.app') + '.cmd', 'w', encoding = 'utf-8')
        fn = (exportpath + fname[:-1] + '/' + fname + extensionf).split('/')[len((exportpath + fname[:-1] + '/' + fname + extensionf).split('/')) - 1].replace('.logicapplication', '.app.js')
        fi.write(f'''@echo off
set NULL_VAL=null
set NODE_VER=%NULL_VAL%
set NODE_EXEC=node-v10.15.3-x86.msi
node -v >.tmp_nodever
set /p NODE_VER=<.tmp_nodever
del .tmp_nodever
IF "%NODE_VER%"=="%NULL_VAL%" (
	echo.
	echo Installing dependencies.
	start "" http://nodejs.org/dist/v14.15.4/%NODE_EXEC%
	echo.
	echo.
	echo Installed.
)
node {fn} %*
''')
        fi.close()
        fi = open((exportpath + fname[:-1] + '/' + fname + extensionf).replace('.logicapplication', '.app') + '.sh', 'w', encoding = 'utf-8')
        fn = (exportpath + fname[:-1] + '/' + fname + extensionf).split('/')[len((exportpath + fname[:-1] + '/' + fname + extensionf).split('/')) - 1].replace('.logicapplication', '.app.js')
        fi.write(f'''node -v || sudo apt install nodejs
node {fn} $*
''')
        fi.close()
        return
    fi = open(f, 'w', encoding = 'utf-8')
    fi.write(c)
    fi.close()
