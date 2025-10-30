#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

cleanup() {
    log "Cleaning up processes..."
    jobs -p | xargs -r kill 2>/dev/null || true
    wait 2>/dev/null || true
    log "Cleanup complete"
}

trap cleanup EXIT INT TERM

start_service() {
    local cmd=$1
    local name=$2

    log "Starting $name..."
    $cmd &
    local pid=$!

    log "$name started with PID: $pid"
}

main() {
    log "Starting multiple Python services..."

    # Start your Python scripts in the background
    start_service "python ./fare_agent.py" "FirstPythonScript"
    start_service "python ./scenic_spot_agent.py" "SecondPythonScript"
    start_service "python ./hotel_agent.py" "ThirdPythonScript"
    start_service "python ./table_agent.py" "FourthPythonScript"
    start_service "python ./modify_agent.py" "FifthPythonScript"
    start_service "python ./master_agent.py" "SixthPythonScript"

    log "All services have been started"
    log "Press Ctrl+C to stop all services"

    wait
}

main "$@"
