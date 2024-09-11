#!/usr/bin/env bash
# wait-for-it.sh

backend_status="000"
timeout=360
start_time=$(date +%s)

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

echo "Calling command npm run ... now!"

exec npm run "$@"