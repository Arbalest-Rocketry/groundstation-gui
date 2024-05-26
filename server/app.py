from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
import serial
import serial.tools.list_ports
from datetime import datetime
import os

# Serial port setup
BAUD_RATE = 9600

#find 
def find_serial_port():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        print(f"Found port: {port.device}, Description: {port.description}")
        # Update the condition based on the actual description
        if 'USB' in port.description:
            return port.device
    return None

SERIAL_PORT = find_serial_port()
if not SERIAL_PORT:
    raise Exception("No compatible serial port found")

print(f"Using serial port: {SERIAL_PORT}")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # allow every paths to access
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['SECRET_KEY'] = 'secret!'

try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
except serial.SerialException as e:
    raise Exception(f"Could not open serial port {SERIAL_PORT}: {e}")

def open_serial_port():
    while True:
        socketio.sleep(0.001)
        try:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                try:
                    data = json.loads(line)
                    print(data)

                    data_with_timestamp = add_timestamp(data)
                    save_to_json_file(data_with_timestamp)
                    socketio.emit('graph_update', data_with_timestamp, namespace='/client')
                except json.JSONDecodeError as e:
                    print('JSON parsing error', e)
        except serial.SerialException as e:
            print(f"Serial communication error: {e}")

def add_timestamp(data):
    timestamp = datetime.now().isoformat()
    data_with_timestamp = {"timestamp": timestamp, **data}
    return data_with_timestamp

def save_to_json_file(data):
    file_path = os.path.join(os.path.dirname(__file__), 'received_message.json')
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r+') as file:
                file_data = json.load(file)
                file_data.append(data)
                file.seek(0)
                json.dump(file_data, file, indent=2)
        else:
            with open(file_path, 'w') as file:
                json.dump([data], file, indent=2)
    except Exception as e:
        print(f'Error saving data to JSON file: {e}')

@socketio.on('connect', namespace='/client')
def client_connect():
    emit('response', {'data': 'Connected to /client'})

@socketio.on('disconnect', namespace='/client')
def client_disconnect():
    print('Client disconnected from /client')

@app.route('/')
def index():
    return "Server is running!"

if __name__ == '__main__':
    socketio.start_background_task(target=open_serial_port)
    socketio.run(app, host='0.0.0.0', port=5000)
