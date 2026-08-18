#!/bin/sh
set -e

# 1. Check system PATH for maven
if command -v mvn >/dev/null 2>&1; then
  exec mvn "$@"
fi

# 2. Check MAVEN_HOME
if [ -n "$MAVEN_HOME" ] && [ -x "$MAVEN_HOME/bin/mvn" ]; then
  exec "$MAVEN_HOME/bin/mvn" "$@"
fi

# 3. Auto-download Apache Maven 3.9.6 if not pre-installed on container
MAVEN_VERSION="3.9.6"
WRAPPER_DIR="$HOME/.m2/wrapper/dists/apache-maven-$MAVEN_VERSION"
MAVEN_EXEC="$WRAPPER_DIR/apache-maven-$MAVEN_VERSION/bin/mvn"

if [ ! -x "$MAVEN_EXEC" ]; then
  echo "[mvnw] Maven binary not found in system path. Auto-downloading Apache Maven $MAVEN_VERSION..."
  mkdir -p "$WRAPPER_DIR"
  TMP_ZIP="/tmp/apache-maven-$MAVEN_VERSION-bin.zip"
  URL="https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$MAVEN_VERSION/apache-maven-$MAVEN_VERSION-bin.zip"
  
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$URL" -o "$TMP_ZIP"
  elif command -v wget >/dev/null 2>&1; then
    wget -q "$URL" -O "$TMP_ZIP"
  else
    echo "[mvnw] Error: Neither curl nor wget is available to download Maven." >&2
    exit 1
  fi

  if command -v unzip >/dev/null 2>&1; then
    unzip -q -o "$TMP_ZIP" -d "$WRAPPER_DIR"
  elif command -v python3 >/dev/null 2>&1; then
    python3 -c "import zipfile; zipfile.ZipFile('$TMP_ZIP').extractall('$WRAPPER_DIR')"
  elif command -v python >/dev/null 2>&1; then
    python -c "import zipfile; zipfile.ZipFile('$TMP_ZIP').extractall('$WRAPPER_DIR')"
  elif command -v jar >/dev/null 2>&1; then
    (cd "$WRAPPER_DIR" && jar xf "$TMP_ZIP")
  else
    echo "[mvnw] Error: No zip extraction utility (unzip, python, or jar) found." >&2
    exit 1
  fi
  
  rm -f "$TMP_ZIP"
  chmod +x "$MAVEN_EXEC"
  echo "[mvnw] Apache Maven $MAVEN_VERSION downloaded and installed successfully!"
fi

exec "$MAVEN_EXEC" "$@"
