#!/bin/bash

# Download data files for geo-story-1
# Run from this directory: ./metadata.csv.sh

BASE_URL="https://raw.githubusercontent.com/jstonge/rdag-montreal/refs/heads/main/pipelines/transform/input"

curl -o districts.json "$BASE_URL/districts.geojson"

echo "Downloaded: districts.json"
