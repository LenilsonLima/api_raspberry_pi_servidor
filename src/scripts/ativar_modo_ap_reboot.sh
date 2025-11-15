#!/bin/bash

LOG_FILE="/home/raspberry-server/Desktop/api_raspberry_pi_servidor/src/log/ativar_modo_ap_reboot.log"
exec >> "$LOG_FILE" 2>&1

echo "[INFO] === Iniciando script de ativação do modo AP ==="

###############################################
# 1. BLOQUEAR WIFI AUTOMÁTICO DO BOOKWORM
###############################################

echo "[INFO] Desativando autoconfiguração do Wi-Fi (NetworkManager)..."

sudo mkdir -p /etc/NetworkManager/conf.d
sudo tee /etc/NetworkManager/conf.d/disable-wifi-managed.conf > /dev/null <<EOF
[keyfile]
unmanaged-devices=interface-name:wlan0
EOF

sudo systemctl restart NetworkManager

sudo systemctl disable systemd-networkd-wait-online.service || true
sudo systemctl stop systemd-networkd-wait-online.service || true

###############################################
# 2. LIMPAR WPA_SUPPLICANT CORRETAMENTE
###############################################

echo "[INFO] Limpando wpa_supplicant.conf..."

sudo bash -c 'cat > /etc/wpa_supplicant/wpa_supplicant.conf <<EOF
country=BR
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
EOF'

sudo systemctl stop wpa_supplicant || true

###############################################
# 3. CRIAR CONFIGURAÇÕES HOSTAPD/DNSMASQ
###############################################

echo "[INFO] Criando hostapd.conf..."
sudo tee /etc/default/hostapd > /dev/null <<EOF
DAEMON_CONF="/etc/hostapd/hostapd.conf"
EOF

sudo tee /etc/hostapd/hostapd.conf > /dev/null <<EOF
interface=wlan0
driver=nl80211
ssid=SERVIDOR-RASP
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=12345678
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCMP
EOF

echo "[INFO] Criando dnsmasq.conf..."
sudo tee /etc/dnsmasq.conf > /dev/null <<EOF
interface=wlan0
dhcp-range=10.42.0.50,10.42.0.150,12h
EOF

###############################################
# 4. IP FIXO
###############################################

echo "[INFO] Configurando IP fixo para wlan0..."

sudo sed -i '/interface wlan0/,+4d' /etc/dhcpcd.conf

sudo tee -a /etc/dhcpcd.conf > /dev/null <<EOF
interface wlan0
static ip_address=10.42.0.1/24
nohook wpa_supplicant
EOF

###############################################
# 5. REINÍCIO DOS SERVIÇOS
###############################################

echo "[INFO] Reiniciando serviços AP..."

sudo systemctl restart dhcpcd
sudo systemctl unmask hostapd || true
sudo systemctl enable hostapd
sudo systemctl enable dnsmasq
sudo systemctl restart hostapd
sudo systemctl restart dnsmasq

###############################################
# 6. FINALIZAÇÃO
###############################################

echo "[SUCESSO] Modo Access Point ativado. Reiniciando..."
sudo reboot