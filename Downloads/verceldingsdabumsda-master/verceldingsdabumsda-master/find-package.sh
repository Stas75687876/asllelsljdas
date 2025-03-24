#!/bin/bash

# Dieses Skript sucht nach der package.json und kopiert sie nach /opt/render/project/src/ falls nötig

# Debug-Ausgabe
echo "Aktuelles Verzeichnis: $(pwd)"
echo "Listing des Root-Verzeichnisses:"
ls -la

# Prüfen, ob package.json im aktuellen Verzeichnis ist
if [ -f "package.json" ]; then
  echo "package.json gefunden im aktuellen Verzeichnis"
  # Wenn wir bereits im src Verzeichnis sind, nichts tun
  if [ "$(pwd)" = "/opt/render/project/src" ]; then
    echo "Wir sind bereits im erwarteten Verzeichnis"
  else
    # Kopiere die package.json und andere wichtige Dateien ins erwartete Verzeichnis
    echo "Kopiere package.json nach /opt/render/project/src/"
    mkdir -p /opt/render/project/src
    cp package.json /opt/render/project/src/
    cp package-lock.json /opt/render/project/src/ 2>/dev/null || true
    cp -r prisma /opt/render/project/src/ 2>/dev/null || true
    cp -r src /opt/render/project/src/ 2>/dev/null || true
    cp -r public /opt/render/project/src/ 2>/dev/null || true
    cp -r .next /opt/render/project/src/ 2>/dev/null || true
    cp next.config.js /opt/render/project/src/ 2>/dev/null || true
    cp tsconfig.json /opt/render/project/src/ 2>/dev/null || true
  fi
else
  # Suche die package.json rekursiv
  echo "package.json nicht im aktuellen Verzeichnis gefunden, suche in Unterverzeichnissen"
  PACKAGE_PATH=$(find . -name "package.json" -type f | head -1)
  
  if [ -n "$PACKAGE_PATH" ]; then
    PACKAGE_DIR=$(dirname "$PACKAGE_PATH")
    echo "package.json gefunden in: $PACKAGE_DIR"
    
    # Kopiere alle Dateien aus dem Verzeichnis nach /opt/render/project/src/
    echo "Kopiere Dateien nach /opt/render/project/src/"
    mkdir -p /opt/render/project/src
    cp -r "$PACKAGE_DIR"/* /opt/render/project/src/
  else
    echo "FEHLER: Keine package.json gefunden!"
    exit 1
  fi
fi

# Überprüfe das Ergebnis
echo "Inhalt von /opt/render/project/src/:"
ls -la /opt/render/project/src/

# Kehre zurück zum ursprünglichen Verzeichnis, falls wir es gewechselt haben
cd /opt/render/project/src/ 