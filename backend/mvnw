#!/bin/sh
# Lightweight Maven Wrapper script for Linux/Render deployments

if command -v mvn >/dev/null 2>&1; then
  exec mvn "$@"
elif [ -n "$MAVEN_HOME" ] && [ -x "$MAVEN_HOME/bin/mvn" ]; then
  exec "$MAVEN_HOME/bin/mvn" "$@"
else
  echo "Error: Maven is not installed or MAVEN_HOME is not set." >&2
  exit 1
fi
