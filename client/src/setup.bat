@echo off

:: Install Python packages from requirements.txt
if exist requirements.txt (
    echo Installing Python packages...
    pip install -r requirements.txt
) else (
    echo No requirements.txt file found.
)

:: Install npm packages from package.json
if exist package.json (
    echo Installing npm packages...
    npm install
) else (
    echo No package.json file found.
)

echo Setup complete.
pause
