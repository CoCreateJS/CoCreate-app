/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * Licensed under GNU AGPLv3.
 ********************************************************************************/

/**
 * Seeding Payload: servers_config collection (Autoscaler)
 * 
 * Autoscaler configurations for cloud providers, instance types, regions,
 * and cluster autoscaling policies stored in the 'servers_config' array.
 */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "65f8cb447b39a3c1a8904e30",
            "type": "autoscaler",
            "name": "Cluster Autoscale Configuration",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "startupScript": {
                    "$concat": [[`#!/usr/bin/env bash
# ==============================================================================
# CoCreate WebService Startup Script (Cloud-Init / User Data)
# Zero-Trust / Immutable Node Lockdown
# ==============================================================================
set -euo pipefail

# ------------------------------------------------------------------------------
# 1. Host System Directories Preparation
# ------------------------------------------------------------------------------
echo "[CoCreate] Preparing workspace directories..."
mkdir -p /var/log/cocreatews
mkdir -p /etc/cocreatews

# ------------------------------------------------------------------------------
# 2. Linux Swap Space Provisioning (4GB Fixed Safety Net)
# ------------------------------------------------------------------------------
if ! grep -q '/swapfile' /etc/fstab; then
  echo "[CoCreate] Configuring 4GB disk swap space..."
  fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
else
  echo "[CoCreate] Swap file already present, skipping swap creation."
fi

# ------------------------------------------------------------------------------
# 3. Download Latest Binary (Public GitHub Release - No API Key Needed)
# ------------------------------------------------------------------------------
if [ -f /usr/local/bin/cocreatews-linux-x86 ]; then
  echo "[CoCreate] Binary already present locally at /usr/local/bin/cocreatews-linux-x86, skipping download."
else
  echo "[CoCreate] Fetching latest compiled binary from public GitHub Releases..."
  curl -sL https://github.com/CoCreate-app/CoCreateWS/releases/latest/download/cocreatews-linux-x86 -o /usr/local/bin/cocreatews-linux-x86
fi
chmod +x /usr/local/bin/cocreatews-linux-x86

# ------------------------------------------------------------------------------
# 4. Systemd Service Unit Provisioning
# ------------------------------------------------------------------------------
echo "[CoCreate] Creating systemd service unit..."
cat << 'EOF' > /etc/cocreatews/environment
NODE_ENV=production
organization_id=`, "$payload.organization_id", "\n", "$payload.data.environment", `
EOF
chmod 600 /etc/cocreatews/environment

cat << 'EOF' > /etc/systemd/system/cocreatews.service
[Unit]
Description=CoCreate WebService Node
After=network.target

[Service]
Type=simple
User=root
Restart=always
RestartSec=3

EnvironmentFile=/etc/cocreatews/environment

# Execution & Logging
ExecStart=/usr/local/bin/cocreatews-linux-x86
StandardOutput=append:/var/log/cocreatews/output.log
StandardError=append:/var/log/cocreatews/error.log

# Graceful Shutdown for AWS Spot Interruption (2-minute / 120s warning)
# systemd sends SIGTERM first and grants 110s for connection draining & metrics flush
KillSignal=SIGTERM
TimeoutStopSec=110

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd daemon and enable service
systemctl daemon-reload
systemctl enable cocreatews

# ------------------------------------------------------------------------------
# 5. Boot WebService via Systemd
# ------------------------------------------------------------------------------
echo "[CoCreate] Booting WebService node via systemd..."
systemctl restart cocreatews

# ------------------------------------------------------------------------------
# 6. Security Hardening: Lockdown Server & Close Port 22 (Disable SSH)
# ------------------------------------------------------------------------------
echo "[CoCreate] Locking down server: configuring firewall and disabling SSH..."

if command -v ufw >/dev/null 2>&1; then
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw deny 22/tcp
  ufw --force enable || true
fi

# Stop, disable, and mask SSH daemon so it cannot be started
systemctl stop sshd || systemctl stop ssh || true
systemctl disable sshd || systemctl disable ssh || true
systemctl mask sshd || systemctl mask ssh || true

echo "[CoCreate] Node successfully locked down. HTTP (80) & HTTPS (443) open, SSH (22) disabled."`]]
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e22",
            "type": "autoscaler",
            "provider": "aws",
            "name": "Amazon Web Services (AWS)",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "clouds.aws": {
                    "image": "ubuntu-24.04-lts",
                    "instances": [
                        { "name": "t3a.nano", "vCPU": 1, "memoryGb": 2, "image": "ubuntu-24.04-lts" },
                        { "name": "t3a.small", "vCPU": 2, "memoryGb": 8, "image": "ubuntu-24.04-lts" },
                        { "name": "t3a.medium", "vCPU": 4, "memoryGb": 16, "image": "ubuntu-24.04-lts" },
                        { "name": "t3a.large", "vCPU": 8, "memoryGb": 32, "image": "ubuntu-24.04-lts" },
                        { "name": "t3a.xlarge", "vCPU": 16, "memoryGb": 64, "image": "ubuntu-24.04-lts" },
                        { "name": "t3a.2xlarge", "vCPU": 32, "memoryGb": 128, "image": "ubuntu-24.04-lts" },
                        { "name": "c5a.4xlarge", "vCPU": 64, "memoryGb": 256, "image": "ubuntu-24.04-lts" }
                    ],
                    "regions": [
                        { "region": "us-east-1", "name": "N. Virginia", "country": "US", "lat": 38.9489, "lng": -77.4499 },
                        { "region": "us-east-2", "name": "Ohio", "country": "US", "lat": 40.1089, "lng": -82.9545 },
                        { "region": "us-west-1", "name": "N. California", "country": "US", "lat": 37.3541, "lng": -121.9552 },
                        { "region": "us-west-2", "name": "Oregon", "country": "US", "lat": 45.8399, "lng": -119.7006 },
                        { "region": "ca-central-1", "name": "Montreal", "country": "CA", "lat": 45.5017, "lng": -73.5673 },
                        { "region": "eu-central-1", "name": "Frankfurt", "country": "DE", "lat": 50.1109, "lng": 8.6821 },
                        { "region": "eu-west-1", "name": "Ireland", "country": "IE", "lat": 53.3498, "lng": -6.2603 },
                        { "region": "eu-west-2", "name": "London", "country": "GB", "lat": 51.5074, "lng": -0.1278 },
                        { "region": "eu-west-3", "name": "Paris", "country": "FR", "lat": 48.8566, "lng": 2.3522 },
                        { "region": "eu-north-1", "name": "Stockholm", "country": "SE", "lat": 59.3293, "lng": 18.0686 },
                        { "region": "eu-south-1", "name": "Milan", "country": "IT", "lat": 45.4642, "lng": 9.1900 },
                        { "region": "ap-northeast-1", "name": "Tokyo", "country": "JP", "lat": 35.6762, "lng": 139.6503 },
                        { "region": "ap-northeast-2", "name": "Seoul", "country": "KR", "lat": 37.5665, "lng": 126.9780 },
                        { "region": "ap-northeast-3", "name": "Osaka", "country": "JP", "lat": 34.6937, "lng": 135.5023 },
                        { "region": "ap-southeast-1", "name": "Singapore", "country": "SG", "lat": 1.3521, "lng": 103.8198 },
                        { "region": "ap-southeast-2", "name": "Sydney", "country": "AU", "lat": -33.8688, "lng": 151.2093 },
                        { "region": "ap-south-1", "name": "Mumbai", "country": "IN", "lat": 19.0760, "lng": 72.8777 },
                        { "region": "sa-east-1", "name": "São Paulo", "country": "BR", "lat": -23.5505, "lng": -46.6333 },
                        { "region": "af-south-1", "name": "Cape Town", "country": "ZA", "lat": -33.9249, "lng": 18.4241 },
                        { "region": "me-south-1", "name": "Bahrain", "country": "BH", "lat": 26.0667, "lng": 50.5577 }
                    ]
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e23",
            "type": "autoscaler",
            "provider": "gcp",
            "name": "Google Cloud Platform (GCP)",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "clouds.gcp": {
                    "image": "ubuntu-2404-lts",
                    "instances": [
                        { "name": "e2-micro", "vCPU": 1, "memoryGb": 2, "image": "ubuntu-2404-lts" },
                        { "name": "e2-standard-2", "vCPU": 2, "memoryGb": 8, "image": "ubuntu-2404-lts" },
                        { "name": "e2-standard-4", "vCPU": 4, "memoryGb": 16, "image": "ubuntu-2404-lts" },
                        { "name": "e2-standard-8", "vCPU": 8, "memoryGb": 32, "image": "ubuntu-2404-lts" },
                        { "name": "e2-standard-16", "vCPU": 16, "memoryGb": 64, "image": "ubuntu-2404-lts" },
                        { "name": "e2-standard-32", "vCPU": 32, "memoryGb": 128, "image": "ubuntu-2404-lts" },
                        { "name": "n2-standard-64", "vCPU": 64, "memoryGb": 256, "image": "ubuntu-2404-lts" }
                    ],
                    "regions": [
                        { "region": "us-central1", "name": "Iowa", "country": "US", "lat": 41.2619, "lng": -95.8608 },
                        { "region": "us-east1", "name": "South Carolina", "country": "US", "lat": 33.1960, "lng": -80.0131 },
                        { "region": "us-east4", "name": "N. Virginia", "country": "US", "lat": 38.9489, "lng": -77.4499 },
                        { "region": "us-west1", "name": "Oregon", "country": "US", "lat": 45.6018, "lng": -121.1842 },
                        { "region": "us-west2", "name": "Los Angeles", "country": "US", "lat": 34.0522, "lng": -118.2437 },
                        { "region": "northamerica-northeast1", "name": "Montreal", "country": "CA", "lat": 45.5017, "lng": -73.5673 },
                        { "region": "southamerica-east1", "name": "São Paulo", "country": "BR", "lat": -23.5505, "lng": -46.6333 },
                        { "region": "europe-west1", "name": "Belgium", "country": "BE", "lat": 50.4541, "lng": 3.8258 },
                        { "region": "europe-west2", "name": "London", "country": "GB", "lat": 51.5074, "lng": -0.1278 },
                        { "region": "europe-west3", "name": "Frankfurt", "country": "DE", "lat": 50.1109, "lng": 8.6821 },
                        { "region": "europe-west4", "name": "Eemshaven", "country": "NL", "lat": 53.4373, "lng": 6.8335 },
                        { "region": "asia-east1", "name": "Taiwan", "country": "TW", "lat": 24.0518, "lng": 120.5161 },
                        { "region": "asia-east2", "name": "Hong Kong", "country": "HK", "lat": 22.3193, "lng": 114.1694 },
                        { "region": "asia-northeast1", "name": "Tokyo", "country": "JP", "lat": 35.6762, "lng": 139.6503 },
                        { "region": "asia-northeast2", "name": "Osaka", "country": "JP", "lat": 34.6937, "lng": 135.5023 },
                        { "region": "asia-southeast1", "name": "Singapore", "country": "SG", "lat": 1.3521, "lng": 103.8198 },
                        { "region": "asia-south1", "name": "Mumbai", "country": "IN", "lat": 19.0760, "lng": 72.8777 },
                        { "region": "australia-southeast1", "name": "Sydney", "country": "AU", "lat": -33.8688, "lng": 151.2093 }
                    ]
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e24",
            "type": "autoscaler",
            "provider": "azure",
            "name": "Microsoft Azure",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "clouds.azure": {
                    "image": "ubuntu-24_04-lts",
                    "instances": [
                        { "name": "Standard_B1s", "vCPU": 1, "memoryGb": 2, "image": "ubuntu-24_04-lts" },
                        { "name": "Standard_B2s", "vCPU": 2, "memoryGb": 8, "image": "ubuntu-24_04-lts" },
                        { "name": "Standard_B4ms", "vCPU": 4, "memoryGb": 16, "image": "ubuntu-24_04-lts" },
                        { "name": "Standard_B8ms", "vCPU": 8, "memoryGb": 32, "image": "ubuntu-24_04-lts" },
                        { "name": "Standard_B16ms", "vCPU": 16, "memoryGb": 64, "image": "ubuntu-24_04-lts" },
                        { "name": "Standard_B32ms", "vCPU": 32, "memoryGb": 128, "image": "ubuntu-24_04-lts" },
                        { "name": "Standard_D64s_v5", "vCPU": 64, "memoryGb": 256, "image": "ubuntu-24_04-lts" }
                    ],
                    "regions": [
                        { "region": "eastus", "name": "Virginia", "country": "US", "lat": 37.3719, "lng": -79.8164 },
                        { "region": "eastus2", "name": "Virginia 2", "country": "US", "lat": 36.6681, "lng": -78.3881 },
                        { "region": "westus", "name": "California", "country": "US", "lat": 37.7833, "lng": -122.4167 },
                        { "region": "westus2", "name": "Washington", "country": "US", "lat": 47.2330, "lng": -119.8520 },
                        { "region": "centralus", "name": "Iowa", "country": "US", "lat": 41.5908, "lng": -93.6208 },
                        { "region": "canadacentral", "name": "Toronto", "country": "CA", "lat": 43.6532, "lng": -79.3832 },
                        { "region": "brazilsouth", "name": "São Paulo", "country": "BR", "lat": -23.5505, "lng": -46.6333 },
                        { "region": "northeurope", "name": "Ireland", "country": "IE", "lat": 53.3498, "lng": -6.2603 },
                        { "region": "westeurope", "name": "Netherlands", "country": "NL", "lat": 52.3676, "lng": 4.9041 },
                        { "region": "ukwest", "name": "Cardiff", "country": "GB", "lat": 51.4815, "lng": -3.1791 },
                        { "region": "ukeast", "name": "London", "country": "GB", "lat": 51.5074, "lng": -0.1278 },
                        { "region": "francecentral", "name": "Paris", "country": "FR", "lat": 48.8566, "lng": 2.3522 },
                        { "region": "germanywestcentral", "name": "Frankfurt", "country": "DE", "lat": 50.1109, "lng": 8.6821 },
                        { "region": "japaneast", "name": "Tokyo", "country": "JP", "lat": 35.6762, "lng": 139.6503 },
                        { "region": "japanwest", "name": "Osaka", "country": "JP", "lat": 34.6937, "lng": 135.5023 },
                        { "region": "southeastasia", "name": "Singapore", "country": "SG", "lat": 1.3521, "lng": 103.8198 },
                        { "region": "australiaeast", "name": "New South Wales", "country": "AU", "lat": -33.8688, "lng": 151.2093 },
                        { "region": "centralindia", "name": "Pune", "country": "IN", "lat": 18.5204, "lng": 73.8567 }
                    ]
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e25",
            "type": "autoscaler",
            "provider": "digitalocean",
            "name": "DigitalOcean Cloud",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "clouds.digitalocean": {
                    "image": "ubuntu-24-04-x64",
                    "instances": [
                        { "name": "s-1vcpu-2gb", "vCPU": 1, "memoryGb": 2, "image": "ubuntu-24-04-x64" },
                        { "name": "s-2vcpu-8gb", "vCPU": 2, "memoryGb": 8, "image": "ubuntu-24-04-x64" },
                        { "name": "s-4vcpu-16gb", "vCPU": 4, "memoryGb": 16, "image": "ubuntu-24-04-x64" },
                        { "name": "s-8vcpu-32gb", "vCPU": 8, "memoryGb": 32, "image": "ubuntu-24-04-x64" },
                        { "name": "s-16vcpu-64gb", "vCPU": 16, "memoryGb": 64, "image": "ubuntu-24-04-x64" },
                        { "name": "s-32vcpu-128gb", "vCPU": 32, "memoryGb": 128, "image": "ubuntu-24-04-x64" },
                        { "name": "s-64vcpu-256gb", "vCPU": 64, "memoryGb": 256, "image": "ubuntu-24-04-x64" }
                    ],
                    "regions": [
                        { "region": "nyc1", "name": "New York 1", "country": "US", "lat": 40.7128, "lng": -74.0060 },
                        { "region": "nyc3", "name": "New York 3", "country": "US", "lat": 40.7128, "lng": -74.0060 },
                        { "region": "sfo3", "name": "San Francisco", "country": "US", "lat": 37.7749, "lng": -122.4194 },
                        { "region": "ams3", "name": "Amsterdam", "country": "NL", "lat": 52.3676, "lng": 4.9041 },
                        { "region": "sgp1", "name": "Singapore", "country": "SG", "lat": 1.3521, "lng": 103.8198 },
                        { "region": "lon1", "name": "London", "country": "GB", "lat": 51.5074, "lng": -0.1278 },
                        { "region": "fra1", "name": "Frankfurt", "country": "DE", "lat": 50.1109, "lng": 8.6821 },
                        { "region": "tor1", "name": "Toronto", "country": "CA", "lat": 43.6532, "lng": -79.3832 },
                        { "region": "blr1", "name": "Bangalore", "country": "IN", "lat": 12.9716, "lng": 77.5946 },
                        { "region": "syd1", "name": "Sydney", "country": "AU", "lat": -33.8688, "lng": 151.2093 }
                    ]
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e26",
            "type": "autoscaler",
            "provider": "oci",
            "name": "Oracle Cloud Infrastructure (OCI)",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "clouds.oci": {
                    "image": "ubuntu-24.04",
                    "instances": [
                        { "name": "VM.Standard.E4.Flex-1v2g", "vCPU": 1, "memoryGb": 2, "image": "ubuntu-24.04" },
                        { "name": "VM.Standard.E4.Flex-2v8g", "vCPU": 2, "memoryGb": 8, "image": "ubuntu-24.04" },
                        { "name": "VM.Standard.E4.Flex-4v16g", "vCPU": 4, "memoryGb": 16, "image": "ubuntu-24.04" },
                        { "name": "VM.Standard.E4.Flex-8v32g", "vCPU": 8, "memoryGb": 32, "image": "ubuntu-24.04" },
                        { "name": "VM.Standard.E4.Flex-16v64g", "vCPU": 16, "memoryGb": 64, "image": "ubuntu-24.04" },
                        { "name": "VM.Standard.E4.Flex-32v128g", "vCPU": 32, "memoryGb": 128, "image": "ubuntu-24.04" },
                        { "name": "VM.Standard.E4.Flex-64v256g", "vCPU": 64, "memoryGb": 256, "image": "ubuntu-24.04" }
                    ],
                    "regions": [
                        { "region": "us-ashburn-1", "name": "Ashburn", "country": "US", "lat": 39.0438, "lng": -77.4874 },
                        { "region": "us-phoenix-1", "name": "Phoenix", "country": "US", "lat": 33.4484, "lng": -112.0740 },
                        { "region": "us-sanjose-1", "name": "San Jose", "country": "US", "lat": 37.3382, "lng": -121.8863 },
                        { "region": "ca-toronto-1", "name": "Toronto", "country": "CA", "lat": 43.6532, "lng": -79.3832 },
                        { "region": "sa-saopaulo-1", "name": "São Paulo", "country": "BR", "lat": -23.5505, "lng": -46.6333 },
                        { "region": "eu-frankfurt-1", "name": "Frankfurt", "country": "DE", "lat": 50.1109, "lng": 8.6821 },
                        { "region": "eu-zurich-1", "name": "Zurich", "country": "CH", "lat": 47.3769, "lng": 8.5417 },
                        { "region": "eu-amsterdam-1", "name": "Amsterdam", "country": "NL", "lat": 52.3676, "lng": 4.9041 },
                        { "region": "uk-london-1", "name": "London", "country": "GB", "lat": 51.5074, "lng": -0.1278 },
                        { "region": "ap-tokyo-1", "name": "Tokyo", "country": "JP", "lat": 35.6762, "lng": 139.6503 },
                        { "region": "ap-osaka-1", "name": "Osaka", "country": "JP", "lat": 34.6937, "lng": 135.5023 },
                        { "region": "ap-seoul-1", "name": "Seoul", "country": "KR", "lat": 37.5665, "lng": 126.9780 },
                        { "region": "ap-sydney-1", "name": "Sydney", "country": "AU", "lat": -33.8688, "lng": 151.2093 },
                        { "region": "ap-mumbai-1", "name": "Mumbai", "country": "IN", "lat": 19.0760, "lng": 72.8777 },
                        { "region": "me-jeddah-1", "name": "Jeddah", "country": "SA", "lat": 21.5433, "lng": 39.1728 }
                    ]
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e27",
            "type": "autoscaler",
            "provider": "hetzner",
            "name": "Hetzner Cloud",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "clouds.hetzner": {
                    "image": "ubuntu-24.04",
                    "instances": [
                        { "name": "cx11", "vCPU": 1, "memoryGb": 2, "image": "ubuntu-24.04" },
                        { "name": "cx22", "vCPU": 2, "memoryGb": 8, "image": "ubuntu-24.04" },
                        { "name": "cx32", "vCPU": 4, "memoryGb": 16, "image": "ubuntu-24.04" },
                        { "name": "cx42", "vCPU": 8, "memoryGb": 32, "image": "ubuntu-24.04" },
                        { "name": "cx52", "vCPU": 16, "memoryGb": 64, "image": "ubuntu-24.04" },
                        { "name": "ccx43", "vCPU": 32, "memoryGb": 128, "image": "ubuntu-24.04" },
                        { "name": "ccx63", "vCPU": 64, "memoryGb": 256, "image": "ubuntu-24.04" }
                    ],
                    "regions": [
                        { "region": "fsn1", "name": "Falkenstein", "country": "DE", "lat": 50.4779, "lng": 12.3713 },
                        { "region": "nbg1", "name": "Nuremberg", "country": "DE", "lat": 49.4521, "lng": 11.0767 },
                        { "region": "hel1", "name": "Helsinki", "country": "FI", "lat": 60.1699, "lng": 24.9384 },
                        { "region": "ash", "name": "Ashburn", "country": "US", "lat": 39.0438, "lng": -77.4874 },
                        { "region": "hil", "name": "Hillsboro", "country": "US", "lat": 45.5229, "lng": -122.9898 },
                        { "region": "sin", "name": "Singapore", "country": "SG", "lat": 1.3521, "lng": 103.8198 }
                    ]
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e28",
            "type": "autoscaler",
            "provider": "vultr",
            "name": "Vultr Cloud Platform",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "clouds.vultr": {
                    "image": "ubuntu-24-04-x64",
                    "instances": [
                        { "name": "vc2-1c-2gb", "vCPU": 1, "memoryGb": 2, "image": "ubuntu-24-04-x64" },
                        { "name": "vc2-2c-8gb", "vCPU": 2, "memoryGb": 8, "image": "ubuntu-24-04-x64" },
                        { "name": "vc2-4c-16gb", "vCPU": 4, "memoryGb": 16, "image": "ubuntu-24-04-x64" },
                        { "name": "vc2-8c-32gb", "vCPU": 8, "memoryGb": 32, "image": "ubuntu-24-04-x64" },
                        { "name": "vc2-16c-64gb", "vCPU": 16, "memoryGb": 64, "image": "ubuntu-24-04-x64" },
                        { "name": "vc2-32c-128gb", "vCPU": 32, "memoryGb": 128, "image": "ubuntu-24-04-x64" },
                        { "name": "vc2-64c-256gb", "vCPU": 64, "memoryGb": 256, "image": "ubuntu-24-04-x64" }
                    ],
                    "regions": [
                        { "region": "ewr", "name": "New Jersey", "country": "US", "lat": 40.7128, "lng": -74.0060 },
                        { "region": "ord", "name": "Chicago", "country": "US", "lat": 41.8781, "lng": -87.6298 },
                        { "region": "dfw", "name": "Dallas", "country": "US", "lat": 32.7767, "lng": -96.7970 },
                        { "region": "sea", "name": "Seattle", "country": "US", "lat": 47.6062, "lng": -122.3321 },
                        { "region": "lax", "name": "Los Angeles", "country": "US", "lat": 34.0522, "lng": -118.2437 },
                        { "region": "atl", "name": "Atlanta", "country": "US", "lat": 33.7490, "lng": -84.3880 },
                        { "region": "mia", "name": "Miami", "country": "US", "lat": 25.7617, "lng": -80.1918 },
                        { "region": "sjc", "name": "Silicon Valley", "country": "US", "lat": 37.3382, "lng": -121.8863 },
                        { "region": "yto", "name": "Toronto", "country": "CA", "lat": 43.6532, "lng": -79.3832 },
                        { "region": "sao", "name": "São Paulo", "country": "BR", "lat": -23.5505, "lng": -46.6333 },
                        { "region": "ams", "name": "Amsterdam", "country": "NL", "lat": 52.3676, "lng": 4.9041 },
                        { "region": "fra", "name": "Frankfurt", "country": "DE", "lat": 50.1109, "lng": 8.6821 },
                        { "region": "lhr", "name": "London", "country": "GB", "lat": 51.5074, "lng": -0.1278 },
                        { "region": "par", "name": "Paris", "country": "FR", "lat": 48.8566, "lng": 2.3522 },
                        { "region": "sgp", "name": "Singapore", "country": "SG", "lat": 1.3521, "lng": 103.8198 },
                        { "region": "nrt", "name": "Tokyo", "country": "JP", "lat": 35.6762, "lng": 139.6503 },
                        { "region": "icn", "name": "Seoul", "country": "KR", "lat": 37.5665, "lng": 126.9780 },
                        { "region": "syd", "name": "Sydney", "country": "AU", "lat": -33.8688, "lng": 151.2093 },
                        { "region": "mel", "name": "Melbourne", "country": "AU", "lat": -37.8136, "lng": 144.9631 },
                        { "region": "blr", "name": "Bangalore", "country": "IN", "lat": 12.9716, "lng": 77.5946 },
                        { "region": "jnb", "name": "Johannesburg", "country": "ZA", "lat": -26.2041, "lng": 28.0473 }
                    ]
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e29",
            "type": "autoscaler",
            "provider": "equinix",
            "name": "Equinix Metal",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "clouds.equinix": {
                    "image": "ubuntu_24_04",
                    "instances": [
                        { "name": "c3.small.x86", "vCPU": 1, "memoryGb": 2, "image": "ubuntu_24_04" },
                        { "name": "c3.medium.x86", "vCPU": 2, "memoryGb": 8, "image": "ubuntu_24_04" },
                        { "name": "c3.large.x86", "vCPU": 4, "memoryGb": 16, "image": "ubuntu_24_04" },
                        { "name": "c3.xlarge.x86", "vCPU": 8, "memoryGb": 32, "image": "ubuntu_24_04" },
                        { "name": "m3.large.x86", "vCPU": 16, "memoryGb": 64, "image": "ubuntu_24_04" },
                        { "name": "m3.xlarge.x86", "vCPU": 32, "memoryGb": 128, "image": "ubuntu_24_04" },
                        { "name": "n3.xlarge.x86", "vCPU": 64, "memoryGb": 256, "image": "ubuntu_24_04" }
                    ],
                    "regions": [
                        { "region": "da", "name": "Dallas", "country": "US", "lat": 32.7767, "lng": -96.7970 },
                        { "region": "ny", "name": "New York", "country": "US", "lat": 40.7128, "lng": -74.0060 },
                        { "region": "sv", "name": "Silicon Valley", "country": "US", "lat": 37.3382, "lng": -121.8863 },
                        { "region": "ch", "name": "Chicago", "country": "US", "lat": 41.8781, "lng": -87.6298 },
                        { "region": "la", "name": "Los Angeles", "country": "US", "lat": 34.0522, "lng": -118.2437 },
                        { "region": "se", "name": "Seattle", "country": "US", "lat": 47.6062, "lng": -122.3321 },
                        { "region": "at", "name": "Atlanta", "country": "US", "lat": 33.7490, "lng": -84.3880 },
                        { "region": "tr", "name": "Toronto", "country": "CA", "lat": 43.6532, "lng": -79.3832 },
                        { "region": "sp", "name": "São Paulo", "country": "BR", "lat": -23.5505, "lng": -46.6333 },
                        { "region": "fr", "name": "Frankfurt", "country": "DE", "lat": 50.1109, "lng": 8.6821 },
                        { "region": "am", "name": "Amsterdam", "country": "NL", "lat": 52.3676, "lng": 4.9041 },
                        { "region": "ld", "name": "London", "country": "GB", "lat": 51.5074, "lng": -0.1278 },
                        { "region": "pa", "name": "Paris", "country": "FR", "lat": 48.8566, "lng": 2.3522 },
                        { "region": "ma", "name": "Madrid", "country": "ES", "lat": 40.4168, "lng": -3.7038 },
                        { "region": "ty", "name": "Tokyo", "country": "JP", "lat": 35.6762, "lng": 139.6503 },
                        { "region": "sg", "name": "Singapore", "country": "SG", "lat": 1.3521, "lng": 103.8198 },
                        { "region": "hk", "name": "Hong Kong", "country": "HK", "lat": 22.3193, "lng": 114.1694 },
                        { "region": "sy", "name": "Sydney", "country": "AU", "lat": -33.8688, "lng": 151.2093 }
                    ]
                }
            }
        }
    ]
};
