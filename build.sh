#!/bin/sh
set -e

export SCRIPT_DIR=$(dirname "$(realpath $0)")
cd $SCRIPT_DIR && echo "Running in $SCRIPT_DIR"
if [ -z $NO_PULL ]; then 
    git fetch --all --prune
    git reset --hard origin/master
    git pull --recurse-submodules
fi

# Build main
./zola build --base-url https://warwickspeed.run --output-dir ../build --force

# Remove redundant css from prod site
if which purgecss; then
    purgecss --config purgecss.config.js
fi

# Swap versions asap
[ -d "../public" ] && mv ../public ../old
mv ../build ../public
rm -rf ../old

[[ -f /srv/restart-lighttpd.sh ]] && sudo /srv/restart-lighttpd.sh