#!/bin/bash

BASE_URL="https://raw.githubusercontent.com/jstonge/rdag-montreal/refs/heads/main/pipelines/transform/input"

curl -o contours.json "$BASE_URL/contours.geojson"

echo "Downloaded: contours.json"
