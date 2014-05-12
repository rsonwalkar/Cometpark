import serial
import requests

#Initialize serial transmission reader.
serialReader = serial.Serial('/dev/ttyACM0', 9600)
print 'Serial transmission initialized\n'

#Parking lot status.
parkingLotStatus = [0, 0, 0, 0]
PARKING_LOT_ID = 'I0'

#Server request parameters.
payload = {'uname':'cometpark', 'password':'cometpark', 'id':'', 'status':''}

while 1:
    try:
        #Read serial transmission.
        message = serialReader.readline()
        print 'Received: {}' .format(message)

        if(4 != len(message)):
            #Invalid message. Discard.
            print 'Invalid message, message length: {}\n' .format(len(message))

            continue
        else:
            #Determine parking space ID and status.
            parkingSpaceId = int(message[0])
            parkingSpaceStatus = int(message[1])

            #Check if the status of given parking space has changed.
            if(parkingSpaceStatus != parkingLotStatus[parkingSpaceId]):
                #Status has changed. Update the server and local data structure.
                id = PARKING_LOT_ID + str(parkingSpaceId)
                status = 'vacant'

                if(1 == parkingSpaceStatus):
                    #Parking space occupied.
                    status = 'occupied'

                payload['id'] = id
                payload['status'] = status
                print 'Requesting server update, parking: {} status: {}' .format(id, status)

                request = requests.put('http://rohitsonwalkar.com:4242/api/parkingstatus', data = payload)

                print 'Server Response: {}\n' .format(request.status_code)

                if(200 == request.status_code):
                    #Server updated. Update local data structure to reflect status change.
                    parkingLotStatus[parkingSpaceId] = parkingSpaceStatus
    except ValueError:
        print '\n*****Message interpretation error*****\n'
    except requests.exceptions.ConnectionError:
        print '\n*****Connection error*****\n'
