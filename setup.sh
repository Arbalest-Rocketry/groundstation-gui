#!/bin/bash

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Navigate to the client folder and install npm dependencies
echo "Installing npm dependencies..."
cd client
npm install

echo "Setup complete."
