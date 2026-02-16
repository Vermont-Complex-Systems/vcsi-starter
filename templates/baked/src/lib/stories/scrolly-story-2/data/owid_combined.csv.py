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
from pathlib import Path

DATA_DIR = Path(__file__).parent

AGGREGATE_ENTITIES = {
    'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'World',
    'High-income countries', 'Low-income countries',
    'Lower-middle-income countries', 'Upper-middle-income countries'
}

DATASETS = [
    {
        'url': 'https://ourworldindata.org/grapher/life-expectancy-vs-electoral-democracy-index.csv?v=1&csvType=full&useColumnShortNames=true',
        'x_col': 'electdem_vdem__estimate_best',
        'x_variable': 'democracy',
        'x_label': 'Electoral Democracy Index',
    },
    {
        'url': 'https://ourworldindata.org/grapher/life-expectancy-vs-gdp-per-capita.csv?v=1&csvType=full&useColumnShortNames=true',
        'x_col': 'gdp_per_capita',
        'x_variable': 'gdp',
        'x_label': 'GDP per Capita',
        'has_population': True,  # This dataset has population_historical
    },
]


def download_raw(url: str) -> pd.DataFrame:
    """Download raw CSV from URL."""
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
    response.raise_for_status()
    return pd.read_csv(StringIO(response.text))


def main():
    # First, download GDP dataset to get population data
    print("Downloading GDP dataset for population data...")
    gdp_df = download_raw(DATASETS[1]['url'])

    # Build population lookup (entity, year) -> population
    pop_lookup = gdp_df[gdp_df['population_historical'].notna()].set_index(['entity', 'year'])['population_historical'].to_dict()

    # Build region lookup from any dataset
    region_lookup = gdp_df[gdp_df['owid_region'].notna()].set_index('entity')['owid_region'].to_dict()

    all_dfs = []

    for config in DATASETS:
        print(f"Processing {config['x_variable']}...")

        if config.get('has_population'):
            df = gdp_df.copy()
        else:
            df = download_raw(config['url'])

        # Apply region lookup
        df['owid_region'] = df['entity'].map(region_lookup)

        # Filter
        df = df[~df['entity'].isin(AGGREGATE_ENTITIES)]
        df = df[df['life_expectancy_0'].notna() & df[config['x_col']].notna()]
        df = df[df['year'] >= 2001]

        # Select columns and rename
        cols = ['entity', 'code', 'year', 'life_expectancy_0', config['x_col'], 'owid_region']
        df = df[cols].copy()
        df = df.rename(columns={
            'life_expectancy_0': 'life_expectancy',
            config['x_col']: 'x_value'
        })
        df['x_variable'] = config['x_variable']

        # Add population from lookup
        df['population'] = df.apply(lambda row: pop_lookup.get((row['entity'], row['year'])), axis=1)

        all_dfs.append(df)

    # Combine all datasets
    combined = pd.concat(all_dfs, ignore_index=True)

    # Save combined long-form CSV
    output_path = DATA_DIR / 'owid_combined.csv'
    combined.to_csv(output_path, index=False)
    print(f"Saved {len(combined)} rows to {output_path.name}")


if __name__ == '__main__':
    main()
