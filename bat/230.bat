cd ..
node tools\setup.js
node --nouse-idle-notification --gc_global --max-old-space-size=2048 pilfer.js 230 2019-03-01 null
pause
