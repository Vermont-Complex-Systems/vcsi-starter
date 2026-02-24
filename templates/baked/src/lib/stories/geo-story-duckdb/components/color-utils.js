import * as d3 from 'd3';

export const DA_METRICS = {
    density:     { label: 'Pop. Density', prop: 'pop_density', fmt: v => `${v?.toFixed(0)}/km²` },
    income:      { label: 'Median Income', prop: 'median_income', fmt: v => `$${v?.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
    population:  { label: 'Population', prop: 'population', fmt: v => v?.toLocaleString() },
    avg_age:     { label: 'Average Age', prop: 'avg_age', fmt: v => v?.toFixed(1) },
    seniors_pct: { label: '% Seniors (65+)', prop: 'seniors_pct', fmt: v => `${v?.toFixed(1)}%` },
    renter_pct:  { label: '% Renters', prop: 'renter_pct', fmt: v => `${v?.toFixed(1)}%` },
    english_pct: { label: '% English Only', prop: 'english_pct', fmt: v => `${v?.toFixed(1)}%` },
};

export function computeColors(features, { metric, binning = 'equal-interval', numBins = 9, domainFeatures = null, percentileCap = null }) {
    const prop = DA_METRICS[metric].prop;
    const values = (domainFeatures ?? features)
        .map(f => f.properties[prop])
        .filter(d => d != null && isFinite(d))
        .sort((a, b) => a - b);
    if (values.length === 0) return { colors: new Map(), colorScale: null };

    let colorScale;
    if (binning === 'quantile') {
        colorScale = d3.scaleQuantile().domain(values).range(d3.schemeYlGnBu[numBins]);
    } else {
        const max = percentileCap ? d3.quantile(values, percentileCap) : d3.max(values);
        colorScale = d3.scaleQuantize().domain([values[0], max]).range(d3.schemeYlGnBu[numBins]);
    }

    const colors = new Map(
        features.map(f => [
            f.properties.geo_uid,
            f.properties[prop] != null && isFinite(f.properties[prop])
                ? colorScale(f.properties[prop])
                : '#e0e0e0'
        ])
    );
    return { colors, colorScale };
}
