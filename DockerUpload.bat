echo Starting Upload Script
set /p version="Version (n for only latest): "
if /i "%version%" == "n" (
docker build . -t oribia/sukigifsapi:latest
docker push oribia/sukigifsapi:latest
) else (
docker build . -t oribia/sukigifsapi:latest
docker build . -t oribia/sukigifsapi:%version%
docker push oribia/sukigifsapi:latest
docker push oribia/sukigifsapi:%version%
)
pause