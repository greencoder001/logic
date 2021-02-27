@echo off
SET __path=%~dp0
node %__path:~0,-1%/cli.js %*
