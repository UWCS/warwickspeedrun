#!/bin/sh
cd "${0%/*}"
git pull
pipenv run python build.py
[[ -f /srv/restart-lighttpd.sh ]] && sudo /srv/restart-lighttpd.sh