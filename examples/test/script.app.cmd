@echo off
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
node script.app.js %*
