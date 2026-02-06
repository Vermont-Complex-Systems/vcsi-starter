#!/usr/bin/env python3
# /// script
# dependencies = ["pandas", "requests"]
# ///
"""
Download and prepare OWID datasets for the scrolly story.
Run: uv run download-data.py

Outputs a single CSV in long form with columns:
  entity, code, year, life_expectancy, x_value, x_variable, owid_region, population
"""

import pandas as pd
import requests
from io import StringIO
from pyprojroot.here import here


AGGREGATE_ENTITIES = {
    'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'World',
    'High-income countries'
}


def download_raw(url: str) -> pd.DataFrame:
    """Download raw CSV from URL."""
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
    response.raise_for_status()
    return pd.read_csv(StringIO(response.text))


def main():
    # First, download GDP dataset to get population data
    
    url="https://ourworldindata.org/grapher/life-expectancy-vs-electoral-democracy-index.csv?v=1&csvType=full&useColumnShortNames=true"
    df = download_raw(url)

    # Filter
    df = df[~df['entity'].isin(AGGREGATE_ENTITIES)]
    df = df[df['life_expectancy_0'].notna() & df["electdem_vdem__estimate_best"].notna()]
    df = df[df['year'] >= 2001]

    # Select columns and rename
    cols = ['entity', 'code', 'year', 'life_expectancy_0', "electdem_vdem__estimate_best", 'owid_region']
    df = df[cols].copy()
    df = df.rename(columns={
        'life_expectancy_0': 'life_expectancy',
        "electdem_vdem__estimate_best": 'x_value'
    })
    # foreshadowing
    df['x_variable'] = "democracy"

    # Save combined long-form CSV
    df.to_csv(here('owid_democracy.csv'), index=False)
    

if __name__ == '__main__':
    main()
