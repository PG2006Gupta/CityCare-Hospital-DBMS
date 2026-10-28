#!/usr/bin/env bash
# City Care Hospital - start the full-stack app
cd "$(dirname "$0")" || exit 1
PORT="${PORT:-8000}"
echo "Starting City Care Hospital at http://localhost:$PORT"
echo "Press Ctrl+C to stop."
PORT="$PORT" python3 server.py
