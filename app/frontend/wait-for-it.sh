#!/usr/bin/env bash
# wait-for-it.sh

# backend_status="000"
# timeout=180
# start_time=$(date +%s)

# until [ "$backend_status" -eq "200" ]; do
#     backend_status=$(curl -s -o /dev/null -w "%{http_code}" backend:3001/healthcheck)
#     if [ $backend_status -eq 200 ]; then
#         echo "Backend is up"
#     else
#         echo "Waiting for backend to be up"
#         sleep 5
#     fi

#     current_time=$(date +%s)

#     # Check timeout
#     elapsed_time=$((current_time - start_time))
#     if [ $elapsed_time -ge $timeout ]; then
#         echo "Timeout reached. Ending the loop."
#         exit 1
#         break
#     fi
# done
# exit 0

#TODO: change script
# Define a function to show usage
usage()
{
    echo "Usage: $0 host:port [-s] [-t timeout] [-- command args]"
    echo "  -h HOST | --host=HOST       Host or IP under test"
    echo "  -p PORT | --port=PORT       TCP port under test"
    echo "  -s | --strict               Only execute subcommand if the test succeeds"
    echo "  -q | --quiet                Don't output any status messages"
    echo "  -t TIMEOUT | --timeout=TIMEOUT"
    echo "                              Timeout in seconds, zero for no timeout"
    echo "  -- COMMAND ARGS             Execute command with args after the test finishes"
    exit 1
}

# Initialize variables
STRICT=0
TIMEOUT=15
QUIET=0

# Parse arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        *:* )
        HOST=$(echo $1 | cut -d: -f1)
        PORT=$(echo $1 | cut -d: -f2)
        shift 1
        ;;
        -q | --quiet)
        QUIET=1
        shift 1
        ;;
        -s | --strict)
        STRICT=1
        shift 1
        ;;
        -t)
        TIMEOUT="$2"
        if [[ "$TIMEOUT" == "" ]]; then break; fi
        shift 2
        ;;
        --timeout=*)
        TIMEOUT="${1#*=}"
        shift 1
        ;;
        --)
        shift
        CLI=("$@")
        break
        ;;
        -h)
        usage
        ;;
        --host=*)
        HOST="${1#*=}"
        shift 1
        ;;
        --port=*)
        PORT="${1#*=}"
        shift 1
        ;;
        *)
        echo "Unknown argument: $1"
        usage
        ;;
    esac
done

if [[ "$HOST" == "" || "$PORT" == "" ]]; then
    echo "Error: you need to provide a host and port to test."
    usage
fi

for i in `seq $TIMEOUT` ; do
    nc -z "$HOST" "$PORT" > /dev/null 2>&1
    result=$?
    if [[ $result -eq 0 ]] ; then
        if [[ $QUIET -ne 1 ]] ; then echo "Success"; fi
        break
    fi
    sleep 1
done

if [[ $STRICT -eq 1 && $result -ne 0 ]]; then
    echo "Timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT"
    exit 1
fi

if [[ $CLI != "" ]]; then
    exec "${CLI[@]}"
else
    exit $result
fi
