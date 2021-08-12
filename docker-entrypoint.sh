#!/bin/bash
set -e

cd /opt/app-root
yarn install

exec "$@"
