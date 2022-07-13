# Copyright (c) 2022 Jexactyl Development.
#!/bin/sh

# Update dependencies
apt update
apt -y upgrade

# Install CuRL
apt install -y curl

# Set Panel to maintainence mode, CuRL release archive and extract it
cd /var/www/pterodactyl
php artisan down
curl -L https://github.com/jexactyl/plugin-manager-addon/releases/latest/download/plugin.tar.gz | tar -xzv

# Install NodeJS and Yarn
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs
npm i -g yarn

# Build Panel
yarn
yarn build:production

# Exit script
clear
php artisan up
echo "Jexactyl Installer | plugin-manager-addon has been installed and your Panel has been built."
