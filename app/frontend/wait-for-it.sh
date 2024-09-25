#!/usr/bin/env bash
# wait-for-it.sh

backend_status="000"
timeout=360
start_time=$(date +%s)

# trap SIGTERM and SIGINT, forwarding them to the child process
trap 'kill -TERM $PID' TERM INT
trap 'kill -INT $PID' INT

until [ "$backend_status" -eq "200" ]; do
    backend_status=$(curl -s -o /dev/null -w "%{http_code}" backend:3001/healthcheck)
    if [ $backend_status -eq 200 ]; then
        echo "Backend is up"
    else
        echo "Waiting for backend to be up"
        sleep 10
    fi

    current_time=$(date +%s)

    # Check timeout
    elapsed_time=$((current_time - start_time))
    if [ $elapsed_time -ge $timeout ]; then
        echo "Timeout reached. Ending the loop."
        exit 1
        break
    fi
done

# Run the command
npm run "$@" &

# Save the PID of the command so we can forward signals to it
PID=$!

# Wait for the command to exit
wait $PID

# forward the exit code of from the command
EXIT_CODE=$?
exit $EXIT_CODE
