cd %~dp0
cd ..
mkdir scripts
cd %~dp0
call npx tsc main.ts --target es6 --outdir ../scripts