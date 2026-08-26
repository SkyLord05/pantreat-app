/**
 * 3WIN & Herberger Modular Pretreatment Plant Digital Twin Simulator
 * Interactive telemetry, sensor monitoring, dosing feedback & live status
 */

class PlantDigitalTwin {
  constructor() {
    this.state = {
      isRunning: true,
      lineSpeedMPerMin: 2.5,
      bathTempC: 75.0,
      targetConcentrationPercent: 4.0,
      actualConcentrationPercent: 3.96,
      pH: 4.85,
      conductivityMs: 14.2,
      turbidityNtu: 3.4,
      dosingPumpRateMlMin: 45.0,
      filterPressureBar: 1.25,
      filterStatus: "Normal (Temiz)",
      heatingPowerKw: 8.5,
      exhaustFanRpm: 1450,
      omegaTensionN: 42.5,
      stretchRatioPercent: 8.0,
      alarms: []
    };
  }

  updateTelemetry(inputs = {}) {
    const s = this.state;
    if (inputs.lineSpeed !== undefined) s.lineSpeedMPerMin = parseFloat(inputs.lineSpeed);
    if (inputs.bathTemp !== undefined) s.bathTempC = parseFloat(inputs.bathTemp);
    if (inputs.stretchRatio !== undefined) s.stretchRatioPercent = parseFloat(inputs.stretchRatio);
    if (inputs.concentration !== undefined) s.targetConcentrationPercent = parseFloat(inputs.concentration);

    // Dynamic small oscillations to simulate live industrial sensors
    const jitter = (Math.random() - 0.5) * 0.04;
    s.actualConcentrationPercent = parseFloat((s.targetConcentrationPercent + jitter).toFixed(2));
    s.pH = parseFloat((4.80 + (s.targetConcentrationPercent * 0.05) + (Math.random() - 0.5) * 0.02).toFixed(2));
    s.conductivityMs = parseFloat((s.actualConcentrationPercent * 3.6 + (Math.random() - 0.5) * 0.1).toFixed(1));
    s.turbidityNtu = parseFloat((3.0 + s.lineSpeedMPerMin * 0.2 + (Math.random() - 0.5) * 0.1).toFixed(1));

    // Dosing rate proportional to line speed & concentration
    s.dosingPumpRateMlMin = parseFloat((s.lineSpeedMPerMin * 18.0 * (s.targetConcentrationPercent / 4)).toFixed(1));
    s.heatingPowerKw = parseFloat(((s.bathTempC / 100) * 11.5 + (Math.random() - 0.5) * 0.2).toFixed(1));
    s.omegaTensionN = parseFloat((35.0 + s.stretchRatioPercent * 1.5 + (Math.random() - 0.5) * 0.5).toFixed(1));

    // Filter pressure differential
    s.filterPressureBar = parseFloat((1.1 + (s.turbidityNtu / 10)).toFixed(2));
    if (s.filterPressureBar > 2.2) {
      s.filterStatus = "UYARI: Filtre Değişimi Gerekli";
      s.alarms.push("Filtre basınç farkı yüksek!");
    } else {
      s.filterStatus = "Optimal (Normal Akış)";
      s.alarms = [];
    }

    return s;
  }
}
