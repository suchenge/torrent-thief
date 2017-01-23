cd ..
node tools\setup.js
node --nouse-idle-notification --gc_global --max-old-space-size=2048 start.js 230 null null
pause