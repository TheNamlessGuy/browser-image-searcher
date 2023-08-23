#!/bin/bash

if [[ -f './image-searcher.zip' ]]; then
  \rm -i './image-searcher.zip'
  if [[ -f './image-searcher.zip' ]]; then
    echo >&2 'Cannot continue while the old .zip exists'
    exit 1
  fi
fi

echo "Zipping..."
zip -r -q './image-searcher.zip' res/ src/ manifest.json