@echo off


if exist requirements.txt (
    echo Installing Python packages...
    pip install -r requirements.txt
) else (
    echo No requirements.txt file found.
)


cd client
if exist package.json (
    echo Installing npm packages...
    npm install
) else (
    echo No package.json file found.
)

echo Setup complete.
pause
