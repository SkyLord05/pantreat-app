/**
 * PANTreat Techno-Economic Analysis, Energy & CO2 Calculator
 * Designed based on ITA & Consortium 1,500 t/a benchmark model
 */

class TechnoEconomicsEngine {
  constructor() {
    this.defaults = {
      capacityTpa: 1500,           // ton / year
      sellingPriceEuroKg: 25.0,    // € / kg
      energyCostKwh: 0.16,         // € / kWh
      co2FactorKgKwh: 0.42,        // kg CO2 per kWh grid average
      capexRetrofitEuro: 950000,   // € modular pretreatment retrofit
      chemicalCostPerKgCf: 0.22,   // € / kg chemical replenishment
      maintenanceCostPerYear: 60000 // € / year
    };
  }

  calculate(inputs = {}) {
    const data = { ...this.defaults, ...inputs };

    const totalKgYear = data.capacityTpa * 1000;
    const baselineTurnover = totalKgYear * data.sellingPriceEuroKg; // € 37,500,000

    // Baseline costs per kg CF
    // Precursor (PAN): 52% (€13.00), Stabilization Energy: 22% (€5.50), Carbonization: 14% (€3.50), Labor/Misc: 12% (€3.00)
    const baselineCostPerKg = 22.0; // Production cost baseline
    const baselineTotalCost = totalKgYear * baselineCostPerKg;

    // Energy consumption figures (kWh / kg CF)
    const baselineStabEnergyKwhPerKg = 16.0; // kWh/kg in 4-oven stabilization
    const baselineTotalEnergyKwhPerKg = 30.0; // Total line energy

    // Savings derived from 20% stabilization energy reduction + 10% net cost drop
    const stabEnergySavedPercent = 20.0;
    const stabEnergySavedKwhPerKg = baselineStabEnergyKwhPerKg * (stabEnergySavedPercent / 100); // 3.2 kWh/kg
    const totalEnergySavedKwhYear = totalKgYear * stabEnergySavedKwhPerKg; // 4,800,000 kWh/year
    const totalEnergyCostSavedYear = totalEnergySavedKwhYear * data.energyCostKwh; // € 768,000 / year

    // Annual CO2 emissions reduction
    const totalCo2SavedTonYear = (totalEnergySavedKwhYear * data.co2FactorKgKwh) / 1000; // 2,016 tons CO2

    // Production time reduction (25% faster throughput potential or line downsizing)
    // 10% cost reduction per kg (€2.50 / kg)
    const grossCostSavingPerKg = data.sellingPriceEuroKg * 0.10; // € 2.50 / kg
    const grossAnnualSavings = totalKgYear * grossCostSavingPerKg; // € 3,750,000 / year

    // Pretreatment operating expenses (Chemicals + extra maintenance)
    const annualChemicalOpex = totalKgYear * data.chemicalCostPerKgCf; // € 330,000 / year
    const totalAnnualOpex = annualChemicalOpex + data.maintenanceCostPerYear; // € 390,000 / year

    // Net Annual Financial Benefit
    const netAnnualSavings = grossAnnualSavings - totalAnnualOpex; // € 3,360,000 / year
    const netCostSavedPerKg = netAnnualSavings / totalKgYear; // € 2.24 / kg

    // Payback Period (Years / Months)
    const paybackYears = data.capexRetrofitEuro / netAnnualSavings;
    const paybackMonths = Math.max(1, Math.round(paybackYears * 12));
    const roi5YearPercent = ((netAnnualSavings * 5 - data.capexRetrofitEuro) / data.capexRetrofitEuro) * 100;

    return {
      inputs: data,
      totalKgYear,
      baselineTurnover,
      baselineTotalCost,
      grossCostSavingPerKg: grossCostSavingPerKg.toFixed(2),
      grossAnnualSavings,
      annualChemicalOpex,
      totalAnnualOpex,
      netAnnualSavings,
      netCostSavedPerKg: netCostSavedPerKg.toFixed(2),
      energy: {
        baselineKwhPerKg: baselineStabEnergyKwhPerKg,
        savedKwhPerKg: stabEnergySavedKwhPerKg.toFixed(1),
        totalKwhSavedYear: totalEnergySavedKwhYear,
        totalEnergyCostSavedYear: Math.round(totalEnergyCostSavedYear),
        totalCo2SavedTonYear: Math.round(totalCo2SavedTonYear)
      },
      roi: {
        paybackMonths,
        paybackYears: paybackYears.toFixed(2),
        roi5YearPercent: Math.round(roi5YearPercent)
      },
      costBreakdown: {
        conventional: {
          precursor: 12.5,
          stabilization: 5.5,
          carbonization: 3.8,
          overhead: 2.2
        },
        pantreat: {
          precursor: 12.5,
          stabilization: 3.6, // reduced from 5.5
          carbonization: 3.5,
          pretreatment: 0.4,
          overhead: 1.8
        }
      }
    };
  }
}
