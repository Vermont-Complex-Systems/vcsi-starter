#!/bin/bash

# Download data files for geo-story-1
# Run from this directory: ./metadata.csv.sh

DOWNLOAD_URL="https://raw.githubusercontent.com/jstonge/uvm-course-viewer/refs/heads/main/transform/output/courses_viz.csv"

curl -o courses_viz.csv "$DOWNLOAD_URL"

echo "Downloaded: courses_viz.csv"