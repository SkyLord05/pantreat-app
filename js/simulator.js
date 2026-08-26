/**
 * PANTreat Thermal Conversion & Stabilization Kinetics Simulator
 * Calculates reaction enthalpy, stabilization degree, temperature curves and mechanical gain
 */

class StabilizationSimulator {
  constructor() {
    this.methods = {
      n2: {
        name: "Azot (N2) Gaz Ön İşlemi",
        efficiencyFactor: 1.18,
        reactionRateBoost: 1.25,
        enthalpyShiftDelta: 18, // °C peak shift
        color: "#00f0ff"
      },
      kmno4: {
        name: "KMnO4 (Sulu Oksidatif Çözelti)",
        efficiencyFactor: 1.28,
        reactionRateBoost: 1.35,
        enthalpyShiftDelta: 26,
        color: "#b000ff"
      },
      h2o2: {
        name: "H2O2 (Hidrojen Peroksit Banyosu)",
        efficiencyFactor: 1.22,
        reactionRateBoost: 1.28,
        enthalpyShiftDelta: 22,
        color: "#00ff66"
      },
      bio: {
        name: "Biyo-Bazlı Özel Katalizör Çözeltisi",
        efficiencyFactor: 1.32,
        reactionRateBoost: 1.40,
        enthalpyShiftDelta: 30,
        color: "#ffe600"
      }
    };
  }

  /**
   * Run simulation with user parameters
   */
  runSimulation(params) {
    const {
      methodKey = 'kmno4',
      bathTemp = 75,       // °C (40-90)
      lineSpeed = 2.5,     // m/min (0.5 - 5.0 pilot)
      stretchRatio = 8.0,  // % (0 - 15)
      concentration = 4.0, // % wt (1 - 10)
      oven1Bypassed = true,
      scale = 'pilot'      // 'pilot' | 'industrial'
    } = params;

    const method = this.methods[methodKey] || this.methods.kmno4;

    // Pretreatment residence time (assuming 5m bath length in pilot, 20m in industrial)
    const bathLength = scale === 'industrial' ? 20.0 : 5.0;
    const actualSpeed = scale === 'industrial' ? Math.max(10, lineSpeed * 4) : lineSpeed;
    const pretreatTimeMin = bathLength / actualSpeed;

    // Environmental / thermodynamic coefficients
    const tempFactor = (bathTemp - 40) / 50 * 0.3 + 0.85; // 0.85 to 1.15
    const concFactor = Math.min(1.25, 0.9 + (concentration / 10) * 0.35);
    const stretchFactor = 1.0 + (stretchRatio / 100) * 0.6; // increases orientation & mechanics

    const totalBoost = method.efficiencyFactor * tempFactor * concFactor;

    // Stabilization timeline computation (Minutes)
    // Conventional: Oven1 (30m, 215°C) -> Oven2 (30m, 240°C) -> Oven3 (30m, 265°C) -> Oven4 (30m, 290°C) = 120m
    const convTimePoints = [];
    const convTempProfile = [];
    const convStabDegree = []; // S (%)

    for (let t = 0; t <= 120; t += 2) {
      convTimePoints.push(t);
      let temp = 200;
      if (t <= 30) temp = 200 + (t / 30) * 15;
      else if (t <= 60) temp = 215 + ((t - 30) / 30) * 25;
      else if (t <= 90) temp = 240 + ((t - 60) / 30) * 25;
      else temp = 265 + ((t - 90) / 30) * 25;
      convTempProfile.push(temp);

      // Degree of stabilization S(t) = (1 - exp(-k * t^1.4)) * 100
      const prog = Math.min(100, Math.pow(t / 120, 1.35) * 100);
      convStabDegree.push(parseFloat(prog.toFixed(1)));
    }

    // PANTreat Profile: Pretreatment (t_pre) + Oven 2 (30m) + Oven 3 (30m) + Oven 4 (30m)
    const panTimePoints = [];
    const panTempProfile = [];
    const panStabDegree = [];

    const ovenTimePerStage = 30 / (method.reactionRateBoost * (oven1Bypassed ? 1.0 : 1.1));
    const totalPanTime = pretreatTimeMin + (oven1Bypassed ? 3 * ovenTimePerStage : 4 * ovenTimePerStage * 0.85);

    // Initial pre-stabilization jump achieved in pretreatment bath
    const initialStabJump = Math.min(32, 18 * totalBoost * (pretreatTimeMin / 2));

    for (let t = 0; t <= totalPanTime + 0.1; t += 1.5) {
      panTimePoints.push(parseFloat(t.toFixed(1)));

      let temp = bathTemp;
      if (t > pretreatTimeMin) {
        const afterPre = t - pretreatTimeMin;
        const totalOven = totalPanTime - pretreatTimeMin;
        temp = 230 + (afterPre / totalOven) * 65; // from 230°C to 295°C
      }
      panTempProfile.push(Math.round(temp));

      if (t <= pretreatTimeMin) {
        const s = (t / pretreatTimeMin) * initialStabJump;
        panStabDegree.push(parseFloat(s.toFixed(1)));
      } else {
        const normalizedAfter = (t - pretreatTimeMin) / (totalPanTime - pretreatTimeMin);
        const s = initialStabJump + (100 - initialStabJump) * Math.pow(normalizedAfter, 1.1);
        panStabDegree.push(parseFloat(Math.min(100, s).toFixed(1)));
      }
    }

    // Mechanical properties outputs
    const baselineStrength = 3.80; // GPa
    const baselineModulus = 240.0; // GPa

    const strengthGain = (method.efficiencyFactor - 1.0) * 0.15 + (stretchRatio / 15) * 0.08;
    const finalStrength = baselineStrength * (1 + strengthGain);
    const finalModulus = baselineModulus * (1 + strengthGain * 0.95);

    // Savings summary
    const timeSavedPercent = ((120 - totalPanTime) / 120) * 100;
    const energySavedPercent = oven1Bypassed ? 20.0 + (tempFactor - 1.0) * 5.0 : 12.0;

    return {
      params,
      method,
      pretreatTimeMin: parseFloat(pretreatTimeMin.toFixed(2)),
      totalPanTime: parseFloat(totalPanTime.toFixed(1)),
      convTotalTime: 120,
      timeSavedPercent: parseFloat(timeSavedPercent.toFixed(1)),
      energySavedPercent: parseFloat(energySavedPercent.toFixed(1)),
      initialStabJump: parseFloat(initialStabJump.toFixed(1)),
      mechanics: {
        baselineStrength: baselineStrength.toFixed(2),
        finalStrength: finalStrength.toFixed(2),
        strengthGainPercent: ((finalStrength - baselineStrength) / baselineStrength * 100).toFixed(1),
        baselineModulus: baselineModulus.toFixed(1),
        finalModulus: finalModulus.toFixed(1),
        modulusGainPercent: ((finalModulus - baselineModulus) / baselineModulus * 100).toFixed(1)
      },
      charts: {
        convTimePoints,
        convTempProfile,
        convStabDegree,
        panTimePoints,
        panTempProfile,
        panStabDegree
      }
    };
  }
}
