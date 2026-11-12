/** Inputs: name, managedOrganization, host, bootstrapStorage, manager, and optional environment. */
export default {
    method: 'object.update', array: 'workflows', upsert: true,
    object: [{
        _id: '6b0600000000000000000001',
        name: 'createClusterConfig', enabled: true,
        description: 'Returns the organization cluster configuration with its own rendered startup script.',
        actions: {
            cluster: {
                name: '$data.name',
                host: '$data.host',
                type: 'organization',
                managedOrganization: '$data.managedOrganization',
                clouds: ['65f8ca227b39a3c1a8904e02'],
                storage: '65f8ca227b39a3c1a8904dfd',
                dns: [],
                binaryUrl: 'https://github.com/CoCreateJS/CoCreate-server/releases/download/dev-latest/cocreate-server-node-linux-x86_64.tar.gz',
                autoscaling: { enabled: 'on' },
                spot: { fallbackToOnDemand: true, enabled: 'on' },
                scaleOut: {
                    cpuThreshold: 85, memoryThreshold: 85, consecutiveFlushes: 3, maxClusterSize: 0
                },
                scaleIn: {
                    cpuThreshold: 10, memoryThreshold: 45, consecutiveFlushes: 10,
                    minClusterSize: 2, drainWaitSeconds: 60, preservation: 'continent',
                    decommissionStrategy: 'oldest'
                },
                geoScale: { enabled: 'on', sheddingThreshold: 20, densityBy: 'continent' },
                vertical: {
                    enabled: 'on', maxNodesPerTier: 2,
                    min: { vCPU: 1, memoryGb: 2 },
                    max: { vCPU: 64, memoryGb: 256 }
                },
                repositories: []
            },
            manager: {
                json: { '$JSON.stringify': '$data.manager' },
                value: { '$JSON.stringify': '$json' }
            },
            storage: {
                json: { '$JSON.stringify': '$data.bootstrapStorage' },
                bytes: { '$Buffer.from': ['$json', 'utf8'] },
                value: { '$bytes.toString': 'base64' }
            },
            bootstrap: {
                config: {
                    organization_id: '$cluster.managedOrganization',
                    host: '$cluster.host',
                    storage: '$data.bootstrapStorage',
                    manager: '$data.manager'
                },
                json: { '$JSON.stringify': '$config' },
                bytes: { '$Buffer.from': ['$json', 'utf8'] },
                value: { '$bytes.toString': 'base64' }
            },
            startupScript: {
                environment: {
                    '$if.$data.environment.$exists': {
                        '$true': '$data.environment',
                        '$else': ''
                    }
                },
                value: `#!/usr/bin/env bash
# ==============================================================================
# CoCreate WebService Startup Script (Cloud-Init / User Data)
# Zero-Trust / Immutable Node Lockdown
# ==============================================================================
set -euo pipefail
umask 077

# ------------------------------------------------------------------------------
# 1. Host System Directories Preparation
# ------------------------------------------------------------------------------
echo "[CoCreate] Preparing workspace directories..."
mkdir -p /var/log/cocreatews
mkdir -p /etc/cocreatews

# Mirror cloud-init output into a persistent file and the provider console so
# failed first boots remain diagnosable without SSH access.
exec > >(tee -a /var/log/cocreatews/startup.log /dev/console) 2>&1
trap 'status=$?; echo "[CoCreate] Startup failed on line $LINENO (exit $status)"; systemctl --no-pager --full status cocreatews 2>/dev/null || true; journalctl --no-pager -u cocreatews -n 100 2>/dev/null || true; exit $status' ERR

# ------------------------------------------------------------------------------
# 2. Linux Swap Space Provisioning (1GB Safety Net)
# ------------------------------------------------------------------------------
if ! grep -q '/swapfile' /etc/fstab; then
  echo "[CoCreate] Configuring 1GB disk swap space..."
  fallocate -l 1G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=1024
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
# 3. Install Node and Download Runtime Bundle (Public GitHub Release)
# ------------------------------------------------------------------------------
echo "[CoCreate] Installing the Node.js runtime..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y --no-install-recommends ca-certificates curl tar xz-utils
if [ ! -x /opt/node-v24.18.0/bin/node ]; then
  curl -fsSL --retry 5 --retry-all-errors --connect-timeout 15     "https://nodejs.org/dist/v24.18.0/node-v24.18.0-linux-x64.tar.xz"     -o /tmp/node-v24.18.0-linux-x64.tar.xz
  echo "55aa7153f9d88f28d765fcdad5ae6945b5c0f98a36881703817e4c450fa76742  /tmp/node-v24.18.0-linux-x64.tar.xz" | sha256sum -c -
  mkdir -p /opt/node-v24.18.0
  tar -xJf /tmp/node-v24.18.0-linux-x64.tar.xz     -C /opt/node-v24.18.0 --strip-components=1
  rm -f /tmp/node-v24.18.0-linux-x64.tar.xz
fi
ln -sfn /opt/node-v24.18.0 /opt/node
/opt/node/bin/node --version

if [ -s /opt/cocreatews/index.js ] && [ -x /opt/cocreatews/plugins/ai/copilot-linux-x64 ]; then
  echo "[CoCreate] Node runtime bundle already present, skipping download."
else
  echo "[CoCreate] Fetching the configured Node runtime bundle from GitHub Releases..."
  mkdir -p /opt/cocreatews
  curl -fsSL --retry 5 --retry-all-errors --connect-timeout 15     "{{$cluster.binaryUrl}}" -o /tmp/cocreatews-node.tar.gz
  test -s /tmp/cocreatews-node.tar.gz
  tar -xzf /tmp/cocreatews-node.tar.gz -C /opt/cocreatews
  rm -f /tmp/cocreatews-node.tar.gz
fi
test -s /opt/cocreatews/index.js
test -x /opt/cocreatews/plugins/ai/copilot-linux-x64
echo "[CoCreate] Node runtime bundle is ready:"
ls -lh /opt/cocreatews/index.js /opt/cocreatews/plugins/ai/copilot-linux-x64
sha256sum /opt/cocreatews/index.js /opt/cocreatews/plugins/ai/copilot-linux-x64
apt-get clean

# ------------------------------------------------------------------------------
# 4. Systemd Service Unit Provisioning
# ------------------------------------------------------------------------------
echo "[CoCreate] Creating systemd service unit..."
cat << 'EOF' > /etc/cocreatews/environment
NODE_ENV=production
organization_id={{$cluster.managedOrganization}}
{{$environment}}
host={{$cluster.host}}
manager={{$manager.value}}
EOF
chmod 600 /etc/cocreatews/environment

# Storage is passed as base64 so connection strings and punctuation cannot be
# misinterpreted by cloud-init, the shell, or systemd's EnvironmentFile parser.
printf '%s' '{{$storage.value}}' | base64 --decode > /etc/cocreatews/storage.json
test -s /etc/cocreatews/storage.json
chmod 600 /etc/cocreatews/storage.json

# Keep the node identity, host, and storage outside the repository.
# Cluster fetches its node API key through CRUD after boot. The managed platform
# credential is supplied separately through the manager environment value above.
# JSON/base64 preserves values; file permissions restrict access.
# Do not print this config or enable shell tracing around credential handling.
printf '%s' '{{$bootstrap.value}}' | base64 --decode > /root/CoCreate.config.js
chmod 600 /root/CoCreate.config.js

cat << 'EOF' > /usr/local/bin/cocreatews-start
#!/usr/bin/env bash
set -euo pipefail
cd /root
export storage="$(cat /etc/cocreatews/storage.json)"
exec /opt/node/bin/node /opt/cocreatews/index.js
EOF
chmod 700 /usr/local/bin/cocreatews-start

cat << 'EOF' > /etc/systemd/system/cocreatews.service
[Unit]
Description=CoCreate WebService Node
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root
Restart=always
RestartSec=3

EnvironmentFile=/etc/cocreatews/environment
Environment=HOME=/root

# Execution & Logging
ExecStart=/usr/local/bin/cocreatews-start
StandardOutput=journal+console
StandardError=journal+console

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
# 5. Security Hardening: Lockdown Server & Close Port 22 (Disable SSH)
# ------------------------------------------------------------------------------
echo "[CoCreate] Locking down server: configuring firewall and disabling SSH..."

if command -v ufw >/dev/null 2>&1; then
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw allow 8090/tcp
  ufw deny 22/tcp
  ufw --force enable || true
fi

# Stop, disable, and mask SSH services and socket activation. Ubuntu may leave
# ssh.socket listening on port 22 after ssh.service has stopped.
for unit in ssh.socket ssh.service sshd.service; do
  systemctl disable --now "$unit" >/dev/null 2>&1 || true
  systemctl mask "$unit" >/dev/null 2>&1 || true
done

if ss -H -lnt | awk '{ print $4 }' | grep -Eq '(^|:)22$'; then
  echo "[CoCreate] SSH shutdown failed: a local process is still listening on port 22." >&2
  exit 1
fi
echo "[CoCreate] SSH services and socket activation are disabled; port 22 has no local listener."

# ------------------------------------------------------------------------------
# 6. Boot WebService via Systemd
# ------------------------------------------------------------------------------
echo "[CoCreate] Booting WebService node via systemd..."
systemctl restart cocreatews

port_is_listening() {
  ss -H -lnt | awk '{ print $4 }' | grep -Eq "(^|:)$1$"
}

for attempt in $(seq 1 90); do
  if systemctl is-active --quiet cocreatews &&     port_is_listening 80 &&     port_is_listening 443 &&     port_is_listening 8090; then
    break
  fi
  sleep 2
done

if ! systemctl is-active --quiet cocreatews ||   ! port_is_listening 80 ||   ! port_is_listening 443 ||   ! port_is_listening 8090; then
  echo "[CoCreate] WebService failed to open all required ports (80, 443, 8090)."
  systemctl --no-pager --full status cocreatews || true
  journalctl --no-pager -u cocreatews -n 100 || true
  echo "[CoCreate] Listening sockets at failure:"
  ss -lntp || true
  exit 1
fi
echo "[CoCreate] WebService is active on ports 80, 443, and 8090. Listening sockets:"
ss -lntp || true

echo "[CoCreate] Node successfully locked down. HTTP (80), HTTPS (443), and mesh (8090) open; SSH (22) disabled."`
            },
            '$cluster.startupScript': '$startupScript.value',
            '$payload.data': '$cluster'
        }
    }]
};
