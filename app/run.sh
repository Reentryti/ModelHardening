#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if [ ! -f "backend/static/index.html" ]; then
    echo "[!] Frontend pas build. Lance: cd frontend && npm ci && npm run build"
fi

python backend/server.py \
    --baseline models/baseline_model.pth \
    --hardened models/hardened_model.pth \
    --port 8080
