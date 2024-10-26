#!/bin/sh
set -e

export SCRIPT_DIR=$(dirname "$(realpath $0)")
cd $SCRIPT_DIR && echo "Running in $SCRIPT_DIR"

git checkout draft
if [ -z $NO_PULL ]; then 
    git fetch --all --prune
    git reset --hard origin/draft
    git pull --recurse-submodules
fi

# Build main
./zola build --base-url https://wasd-draft.uwcs.co.uk --output-dir ../draft/public --force

[[ -f /srv/restart-lighttpd.sh ]] && sudo /srv/restart-lighttpd.sh