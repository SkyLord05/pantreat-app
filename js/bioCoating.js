/**
 * Marmara University & BCD Bio-Based Polyurethane Coating Formulation Engine
 * Calculates stoichiometry, crosslink density, UV curing parameters & corrosion resistance
 */

class BioCoatingEngine {
  constructor() {
    this.rawMaterials = {
      esbo: { name: "Epoksidize Soya Yağı (ESBO)", mw: 950, oxiraneNumber: 6.5 },
      acrylicAcid: { name: "Akrilik Asit (AA)", mw: 72.06, density: 1.05 },
      tdiHema: { name: "TDI-HEMA Adduct (Toluen Diizosiyanat-HEMA)", mw: 304.3, ncoContent: 13.8 },
      photoinitiator: { name: "Darocur 1173 (UV Başlatıcı)", mw: 164.2 }
    };
  }

  /**
   * Calculate formulation stoichiometry & mechanical performance
   */
  calculateFormulation(params = {}) {
    const {
      esboMassGrams = 100,
      aaMolarRatio = 1.0,      // 0.8 to 1.2 mol AA per epoxy group
      tdiHemaRatio = 0.5,      // NCO / OH ratio (0.3 to 0.9)
      uvIntensityMwCm2 = 120,  // mW/cm2 (50 - 250)
      uvExposureSec = 30       // seconds (10 - 60)
    } = params;

    // Epoxide equivalent weight (EEW) = 100 * 16 / oxiraneNumber
    const eew = (100 * 16) / this.rawMaterials.esbo.oxiraneNumber; // ~246 g/eq
    const epoxyEquivalents = esboMassGrams / eew; // ~0.406 mol

    // Required Acrylic Acid
    const requiredAaGrams = epoxyEquivalents * aaMolarRatio * this.rawMaterials.acrylicAcid.mw;
    const aesboYieldGrams = esboMassGrams + requiredAaGrams * 0.98;

    // Hydroxyl content formed from ring opening = 1 OH per acrylate added
    const ohEquivalents = epoxyEquivalents * aaMolarRatio;
    const tdiHemaGrams = ohEquivalents * tdiHemaRatio * (this.rawMaterials.tdiHema.mw);

    // Photoinitiator (3% wt)
    const totalResinGrams = aesboYieldGrams + tdiHemaGrams;
    const piGrams = totalResinGrams * 0.03;
    const totalCoatingGrams = totalResinGrams + piGrams;

    // Performance indicators
    // Gel Content (%) as a function of UV dose and NCO:OH ratio
    const uvDoseMilliJoules = (uvIntensityMwCm2 * uvExposureSec) / 10; // mJ/cm2
    const gelContentPercent = Math.min(99.2, 70 + (uvDoseMilliJoules / 400) * 20 + tdiHemaRatio * 12);

    // Crosslink Density (mol/cm3)
    const crosslinkDensity = (0.8 + tdiHemaRatio * 1.6 + (aaMolarRatio - 0.8) * 0.5) * 1e-3;

    // Pencil Hardness (B, HB, F, H, 2H, 3H, 4H, 5H)
    const hardnessLevels = ['HB', 'F', 'H', '2H', '3H', '4H', '5H'];
    const hardnessIndex = Math.min(6, Math.floor(tdiHemaRatio * 5 + (gelContentPercent / 20)));
    const pencilHardness = hardnessLevels[hardnessIndex];

    // Chemical Corrosion Resistance Score (1 - 100) against KMnO4 & H2O2
    const corrosionScore = Math.min(98.5, 65 + (tdiHemaRatio * 25) + (gelContentPercent / 100) * 15);

    // Adhesion to aluminum frame / stainless steel rollers (ASTM D3359 Cross-hatch grade: 5B is best)
    const adhesionClass = gelContentPercent > 90 && tdiHemaRatio >= 0.4 ? "5B (Mükemmel - Sıfır Dökülme)" : "4B (İyi)";

    return {
      inputs: { esboMassGrams, aaMolarRatio, tdiHemaRatio, uvIntensityMwCm2, uvExposureSec },
      masses: {
        esboGrams: esboMassGrams.toFixed(1),
        aaGrams: requiredAaGrams.toFixed(1),
        tdiHemaGrams: tdiHemaGrams.toFixed(1),
        piGrams: piGrams.toFixed(1),
        totalBatchGrams: totalCoatingGrams.toFixed(1)
      },
      properties: {
        gelContentPercent: gelContentPercent.toFixed(1),
        crosslinkDensity: crosslinkDensity.toExponential(2),
        pencilHardness,
        corrosionScore: corrosionScore.toFixed(1),
        adhesionClass,
        vocEmissions: "0.0 g/L (100% Katı Madde / UV Foto-Kürleme)"
      }
    };
  }
}
