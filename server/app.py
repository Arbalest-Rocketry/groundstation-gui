from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
import serial
import serial.tools.list_ports
from datetime import datetime
import os

# Serial port setup
BAUD_RATE = 9600

# Find serial port
def find_serial_port():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        print(f"Found port: {port.device}, Description: {port.description}")
        if 'USB' in port.description:
            return port.device
    return None

SERIAL_PORT = find_serial_port()
ser = None
# check if the serial connection available
if SERIAL_PORT:
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print(f"Using serial port: {SERIAL_PORT}")
    except serial.SerialException as e:
        print(f"Could not open serial port {SERIAL_PORT}: {e}")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['SECRET_KEY'] = 'secret!'

should_run = False  # decide whether to receive data from teensy

def save_to_json_background_task():
    while True:
        socketio.sleep(1)
        data_with_timestamp = read_serial()
        print('saved', data_with_timestamp)
        if data_with_timestamp:
            save_to_json_file(data_with_timestamp)

def read_serial():
    try:
        if ser and ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').strip()
            try:
                data = json.loads(line)
                data_with_timestamp = add_timestamp(data)
                return data_with_timestamp
            except json.JSONDecodeError as e:
                print('JSON parsing error', e)
    except serial.SerialException as e:
        print(f"Serial communication error: {e}")

def send_recent_data():
    while should_run:
        socketio.sleep(1)
        data_with_timestamp = read_serial()
        if data_with_timestamp:
            socketio.emit('graph_update', data_with_timestamp, namespace='/client')

# add timestamps to the received message
def add_timestamp(data):
    timestamp = datetime.now().isoformat()
    data_with_timestamp = {"timestamp": timestamp, **data}
    return data_with_timestamp

def save_to_json_file(data):
    file_path = os.path.join(os.path.dirname(__file__), 'received_message.json')
    try:
        if os.path.exists(file_path):  # if the file exists
            with open(file_path, 'r+') as file:  # append the received data to the existing data
                try:
                    file_data = json.load(file)
                except json.JSONDecodeError:
                    file_data = []
                file_data.append(data)
                file.seek(0)  # set the start
                json.dump(file_data, file, indent=2)
        else:
            with open(file_path, 'w') as file:
                json.dump([data], file, indent=2)
    except Exception as e:
        print(f'Error saving data to JSON file: {e}')

def read_from_json_file(start=None, end=None):
    file_path = os.path.join(os.path.dirname(__file__), 'received_message.json')
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                file_data = json.load(file)
                if start and end:
                    start_dt = datetime.fromisoformat(start)
                    end_dt = datetime.fromisoformat(end)
                    filtered_data = [entry for entry in file_data if start_dt <= datetime.fromisoformat(entry['timestamp']) <= end_dt]
                    return filtered_data
                return file_data
        else:
            return []
    except Exception as e:
        print(f'Error reading data from JSON file: {e}')
        return []

@socketio.on('connect', namespace='/client')
def client_connect():
    emit('response', {'data': 'Connected to /client'})

@socketio.on('disconnect', namespace='/client')
def client_disconnect():
    print('Client disconnected from /client')

@socketio.on('graph_update_request', namespace='/client')
def update_graph():
    global should_run
    should_run = True
    socketio.start_background_task(target=send_recent_data)

@socketio.on('graph_update_stop', namespace='/client')
def halt_update():
    global should_run
    should_run = False

@socketio.on('request_data_by_range', namespace='/client')
def request_data_by_range(message):
    start = message.get('start')
    end = message.get('end')
    data = read_from_json_file(start, end)
    emit('data_in_range', data, namespace='/client')

@app.route('/')
def index():
    return "Server is running!"

if __name__ == '__main__':
    socketio.start_background_task(target=save_to_json_background_task)
    socketio.run(app, host='0.0.0.0', port=5000)
