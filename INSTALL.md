# Spigot Plugin Manager (v1) ⛏️ - Installation

### Need some help? ℹ️
Please contact me on [Discord](https://discord.com/invite/qttGR4Z5Pk) if you run into any issues during installation.

# BEFORE INSTALLING ⚠️

This add-on will not work that are not in version v1.9.x. If you want to use this plugin manager, consider using Jexactyl. https://jexactyl.com

## Automatic Installation 📥

Download and run the bash script provided in this repository to install files.

```bash
sudo curl -Lo auto-install.sh https://raw.githubusercontent.com/Jexactyl/plugin-manager-addon/main/auto-install.sh
sudo chmod u+x auto-install.sh
sudo ./auto-install.sh
```

## Manual Installation 📥

Download the archive from GitHub and extract it into your `/var/www/pterodactyl` install.

```bash
cd /tmp
git clone https://github.com/jexactyl/plugin-manager-addon

cd plugin-manager-addon
cp -R * /var/www/pterodactyl/
```

Then, you'll need to install NodeJS and Yarn in order to compile the Panel's frontend.

```bash
# Ubuntu/Debian
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs

# CentOS
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs yarn # CentOS 7
sudo dnf install -y nodejs yarn # CentOS 8
```

```bash
npm i -g yarn # Install Yarn

cd /var/www/pterodactyl
yarn # Installs panel build dependencies
```

Finally, build the Panel in production mode to add the UI.

```bash
cd /var/www/pterodactyl
yarn build:production # Build panel
```
