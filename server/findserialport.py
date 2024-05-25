import serial
import serial.tools.list_ports

def find_serial_port():
    dev = serial.tools.list_ports.comports()
    ports=[]

    for d in dev:

        ports.append((d.device, d.serial_number))

    print('\nDetected serial ports:')
    for d in ports:
        print("Port:" + str(d[0]) + "\tSerial Number:" + str(d[1]))


find_serial_port()

def findTo(serial_number):

    for arduino in serial.tools.list_ports.comports():

        if arduino.serial_number == serial_number:

            return (arduino.device)

    raise IOError("There was no such thing.")

#VID : , PID : 1155
        



serial_number = '15255040'

sn = findTo(serial_number)
print("The device you are looking for " + str(sn))

def findTo(vid, pid, serial_number):

    for arduino in serial.tools.list_ports.comports():

        if arduino.vid == vid and arduino.pid == pid and arduino.serial_number == serial_number:

            return (arduino.device)
if findTo(5824,1155,'7'):

    sn = findTo(5824,1155,'15255040')

    print("The device you are looking for " + str(sn))

else:

    sn = findTo(5824,1155,'15255040')

    print("The device you are looking for " + str(sn))