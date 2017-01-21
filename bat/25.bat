cd ..
node tools\setup.js
node --nouse-idle-notification --gc_global --max-old-space-size=2048 start.js pilfer 25 '2016-10-10' 11
pause