#!/bin/bash

# Download GeoJSON and convert to Parquet with spatial geometry.
# Run from this directory: ./census_da.json.sh
# Requires: duckdb CLI with spatial extension

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATIC_DATA="$(cd "$SCRIPT_DIR/../../../../../static/data" && pwd)"
BASE_URL="https://raw.githubusercontent.com/jstonge/rdag-montreal/refs/heads/main/pipelines/transform/input"

echo "Downloading census_da.geojson..."
curl -sS -o "$SCRIPT_DIR/census_da.json" "$BASE_URL/census_da.geojson"

echo "Converting to Parquet..."
duckdb -c "
INSTALL spatial; LOAD spatial;

COPY (
    SELECT
        GeoUID                        AS geo_uid,
        name                          AS da_name,
        \"Region Name\"               AS region_name,
        Population                    AS population,
        Households                    AS households,
        Dwellings                     AS dwellings,
        \"Area (sq km)\"              AS area_sqkm,

        -- age
        avg_age_sex_total,
        pop_total,
        pop_age_0to14,
        pop_age_15to64,
        pop_age_65plus,

        -- income
        median_income_household,
        median_income_aftertax_household,
        median_income_total,
        median_income_male,
        median_income_female,
        median_income_aftertax_total,
        median_income_aftertax_male,
        median_income_aftertax_female,
        avg_income_household,
        avg_income_aftertax_household,
        avg_total_income_total,
        avg_total_income_male,
        avg_total_income_female,

        -- housing tenure
        dwellings_total,
        tenure_owner,
        tenure_renter,

        -- language
        lang_mother_english,
        lang_mother_french,

        -- immigration
        pop_immigrant,

        -- admin codes
        CSD_UID                       AS csd_uid,
        CD_UID                        AS cd_uid,
        CT_UID                        AS ct_uid,
        CMA_UID                       AS cma_uid,

        geom
    FROM ST_Read('$SCRIPT_DIR/census_da.json')
    WHERE Population > 0
) TO '$STATIC_DATA/census_da.parquet' (FORMAT PARQUET);
"

echo "Done: census_da.json + census_da.parquet"
