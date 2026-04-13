#!/bin/bash

BASE_URL="https://raw.githubusercontent.com/jstonge/rdag-montreal/refs/heads/main/pipelines/transform/input"

curl -o streets.json "$BASE_URL/streets.geojson"

echo "Downloaded: streets.json"
