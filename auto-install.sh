#!/bin/sh
# Copyright (c) 2022 Jexactyl Development.

# Alert users that they are installing a add-on that is from v1.9 (credits to Docker for giving this idea)
echo "⚠️ This add-on will only work in Pterodactyl v1.9.x."
echo "Due to the outdated code and multiple updates to the Pterodactyl's code, this add-on will NOT work in any version above or below 1.9.x."
echo 
echo "You can still install this add-on, but your Pterodactyl installation will break if you are not in Pterodactyl 1.9.x."
echo "⚠️ To cancel this installation and keep your Pterodactyl installation working, feel free to exit this script using Control+C."
echo 
echo "If you want to use this plugin manager, it is included on Jexactyl v3.2 and higher. Install it using https://jexactyl.com."
echo 
echo "This message will expire in 20 seconds."
sleep 20

# Update dependencies
apt update
apt -y upgrade

# Install CuRL and Git
apt install -y curl git

# Set Panel to maintenance mode
cd /var/www/pterodactyl || exit
php artisan down

# Download files and move them to the installation dir
cd /tmp || exit
git clone https://github.com/jexactyl/plugin-manager-addon
cp -R plugin-manager-addon/code/* /var/www/pterodactyl/

# Install NodeJS and Yarn
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs
npm i -g yarn

# Build Panel
cd /var/www/pterodactyl || exit
yarn
yarn build:production

# Assign permissions
chown -R www-data:www-data /var/www/pterodactyl/*

# Exit script
clear
php artisan up
echo "Jexactyl Installer | plugin-manager-addon has been installed and your Panel has been built."
