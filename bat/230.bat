cd ..
node tools\setup.js
node --nouse-idle-notification --gc_global --max-old-space-size=2048 start.js 230 2017-01-15 null
pause