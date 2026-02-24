#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATIC_DATA="$(cd "$SCRIPT_DIR/../../../../../static/data" && pwd)"
BASE_URL="https://github.com/jstonge/rdag-montreal/raw/refs/heads/main/pipelines/load/output/"

curl -sSL -o "$STATIC_DATA/census_da.parquet" "$BASE_URL/census_da.parquet"