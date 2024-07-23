## configure as WIFI Hotspot
https://www.raspberrypi.com/tutorials/host-a-hotel-wifi-hotspot/

nmcli device

# hotspot erstellen
- sudo nmcli device wifi hotspot ssid <hotspot name> password <hotspot password> ifname wlan0


## connect to wifi

# Wlan Verbindung trennen
- sudo nmcli device disconnect wlan0              

# Wlan suchen
nmcli device wifi list                      
sudo nmcli device wifi rescan

# mit neuem Wlan verbinden
- sudo nmcli device wifi connect <SSID> password <password> ifname wlan0              

# UUID koppieren 
- nmcli connection
# Wlan Priority einstellen
- sudo nmcli connection modify <UUID> connection.autoconnect yes connection.autoconnect-priority 95

# Wlan Einstellungen anzeigen
nmcli connection show <UUID>



