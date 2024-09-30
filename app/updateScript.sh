#!/bin/bash
# Define functions for colored output
echo_orange() {
  echo -e "\033[38;5;214m$1\033[0m"
}
echo_green() {
  echo -e "\033[38;5;46m\n$1\n\n\033[0m"
}
update_dependencies() {
  local dir="$1"
  echo_orange "Updating dependencies in $dir directory"
  cd "$dir" || exit
  # Check if npm-check-updates is installed, if not install it
  if ! command -v ncu &> /dev/null
  then
    npm install -g npm-check-updates
  fi
  # Update dependencies
  ncu -u
  # Remove node_modules and package-lock.json
  rm -rf node_modules
  rm -f package-lock.json
  # Reinstall dependencies with --legacy-peer-deps flag\
  echo_orange "Running npm install"
  # npm install --legacy-peer-deps
  echo_green "Dependencies updated in $dir directory"
  cd - || exit
}
export -f update_dependencies
export -f echo_orange
export -f echo_green

# Update dependencies in the root directory
update_dependencies "."

echo_green "All done"