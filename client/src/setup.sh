#!/bin/bash

# Install Python packages from requirements.txt
if [ -f "./server/requirements.txt" ]; then
    echo "Installing Python packages..."
    pip install -r ./requirements.txt
else
    echo "No requirements.txt file found."
fi

# Install npm packages from package.json
if [ -f "./client/package.json" ]; then
    echo "Installing npm packages..."
    npm install
else
    echo "No package.json file found."
fi

echo "Setup complete."
