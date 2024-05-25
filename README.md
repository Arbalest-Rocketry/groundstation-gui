# Ground-Station-GUI
<div style="display: flex; flex-direction: row;">

# Root of the folder
```
├── client
    ├──src
    ├──public
├── server
    ├──app.py
    ├──venv
├── transceiver
└── README.md
```
```client``` 
This directory contains the React application which serves as the frontend of the Ground Station GUI. It includes all the React components, styles, and other assets needed to build and run the client-side application.

```server```
This directory contains the Flask server which handles the backend operations. The server is responsible for managing WebSocket connections, processing telemetry data, and serving API endpoints.

```transceiver```
This directory contains the Arduino sketches (.ino files) for various boards used in the telemetry system. Each subdirectory within transceiver/ corresponds to a different board and contains the code needed to operate that board.

# Testing Setup

1. Upload any .ino scripts in transceiver directory to breadboard
2. You need to run the server in the directory server. keep connected to the board.
```
source venv/Scripts/ativate
run server.py
```
3. launch client
move the commend prompt to client
```
npm start
```
