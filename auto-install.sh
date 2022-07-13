# Copyright (c) 2022 Jexactyl Development.
#!/bin/sh

# Update dependencies
apt update
apt -y upgrade

# Install CuRL and Git
apt install -y curl git

# Set Panel to maintainence mode
cd /var/www/pterodactyl
php artisan down

# Download files and move them to the installation dir
cd /tmp
git clone https://github.com/jexactyl/plugin-manager-addon
cp -R plugin-manager-addon/code/* /var/www/pterodactyl/

# Install NodeJS and Yarn
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs
npm i -g yarn

# Build Panel
cd /var/www/pterodactyl
yarn
yarn build:production

# Exit script
clear
php artisan up
echo "Jexactyl Installer | plugin-manager-addon has been installed and your Panel has been built."
