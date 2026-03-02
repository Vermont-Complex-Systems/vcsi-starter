import * as d3 from 'd3';

const fmtDollar = v => v != null ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—';
const fmtNum = v => v != null ? v.toLocaleString() : '—';
const fmtPct = v => v != null ? `${v.toFixed(1)}%` : '—';

export const DA_METRICS = {
    density: {
        label: 'Pop. Density',
        prop: 'pop_density',
        fmt: v => `${v?.toFixed(0)}/km²`,
    },
    income: {
        label: 'Median Income',
        prop: 'median_income_household',
        fmt: fmtDollar,
        breakdown: {
            label: 'Income (before tax)',
            fmt: fmtDollar,
            bars: [
                { prop: 'median_income_household', label: 'Household' },
                { prop: 'median_income_total', label: 'Total' },
                { prop: 'median_income_male', label: 'Male' },
                { prop: 'median_income_female', label: 'Female' },
                { prop: 'avg_income_household', label: 'Household', color: '#c22' },
                { prop: 'avg_total_income_total', label: 'Total', color: '#c22' },
                { prop: 'avg_total_income_male', label: 'Male', color: '#c22' },
                { prop: 'avg_total_income_female', label: 'Female', color: '#c22' },
            ],
        },
    },
    population: {
        label: 'Population',
        prop: 'population',
        fmt: fmtNum,
        breakdown: {
            label: 'Population by age group',
            fmt: fmtNum,
            bars: [
                { prop: 'pop_age_0to14', label: '0–14' },
                { prop: 'pop_age_15to64', label: '15–64' },
                { prop: 'pop_age_65plus', label: '65+' },
            ],
        },
    },
    avg_age: {
        label: 'Average Age',
        prop: 'avg_age_sex_total',
        fmt: v => v?.toFixed(1),
    }
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
