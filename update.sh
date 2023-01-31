#!/bin/sh
cd "${0%/*}"
git pull
pipenv run python build.py
