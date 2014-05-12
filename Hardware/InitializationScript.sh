echo 'Initialization script: Wait time 30 seconds' >> /home/pi/Desktop/InitializationScript.log

sleep 30

echo none > /sys/class/leds/led0/trigger
echo 1 > /sys/class/leds/led0/brightness

echo 'Now executing script CometPark.py' >> /home/pi/Desktop/InitializationScript.log

python /home/pi/Desktop/CometPark.py >> /home/pi/Desktop/InitializationScript.log

echo 0 > /sys/class/leds/led0/brightness
echo mmc0 > /sys/class/leds/led0/trigger