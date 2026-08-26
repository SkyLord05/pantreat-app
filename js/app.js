/**
 * PANTreat Platform - Main Application Controller
 * Manages UI tabs, sliders, Chart.js visualizations, digital twin updates & exports
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Engines
  const simulator = new StabilizationSimulator();
  const economics = new TechnoEconomicsEngine();
  const bioCoating = new BioCoatingEngine();
  const plantTwin = new PlantDigitalTwin();

  // Chart instances container
  const charts = {};

  // Initialize UI Components
  initNavigation();
  initSimulatorControls();
  initEconomicsControls();
  initBioCoatingControls();
  initPlantTwinControls();
  initConsortiumView();
  initExportHandlers();

  // Initial runs
  updateSimulator();
  updateEconomics();
  updateBioCoating();
  updatePlantTwin();

  // Live interval for plant digital twin sensor telemetry jitter
  setInterval(() => {
    if (document.getElementById('tab-planttwin').classList.contains('active')) {
      updatePlantTwin();
    }
  }, 2000);

  /**
   * Tab Navigation Logic
   */
  function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');

        navButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(targetId);
        if (activePanel) {
          activePanel.classList.add('active');
          // Resize charts on tab switch to prevent visual clipping
          Object.values(charts).forEach(c => c && c.resize && c.resize());
        }
      });
    });
  }

  /**
   * Simulator Controls & Charting
   */
  function initSimulatorControls() {
    const inputs = ['sim-method', 'sim-speed', 'sim-temp', 'sim-stretch', 'sim-conc', 'sim-oven-bypass', 'sim-scale'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          updateSimulator();
        });
      }
    });

    // Preset buttons
    const presetPilot = document.getElementById('btn-preset-pilot');
    if (presetPilot) {
      presetPilot.addEventListener('click', () => {
        document.getElementById('sim-scale').value = 'pilot';
        document.getElementById('sim-speed').value = '2.5';
        document.getElementById('sim-temp').value = '75';
        document.getElementById('sim-stretch').value = '8';
        document.getElementById('sim-conc').value = '4';
        document.getElementById('sim-oven-bypass').checked = true;
        updateSimulator();
      });
    }

    const presetIndustrial = document.getElementById('btn-preset-industrial');
    if (presetIndustrial) {
      presetIndustrial.addEventListener('click', () => {
        document.getElementById('sim-scale').value = 'industrial';
        document.getElementById('sim-speed').value = '15.0';
        document.getElementById('sim-temp').value = '85';
        document.getElementById('sim-stretch').value = '12';
        document.getElementById('sim-conc').value = '5';
        document.getElementById('sim-oven-bypass').checked = true;
        updateSimulator();
      });
    }
  }

  function updateSimulator() {
    const methodKey = document.getElementById('sim-method').value;
    const lineSpeed = parseFloat(document.getElementById('sim-speed').value);
    const bathTemp = parseFloat(document.getElementById('sim-temp').value);
    const stretchRatio = parseFloat(document.getElementById('sim-stretch').value);
    const concentration = parseFloat(document.getElementById('sim-conc').value);
    const oven1Bypassed = document.getElementById('sim-oven-bypass').checked;
    const scale = document.getElementById('sim-scale').value;

    // Update Slider Displays
    document.getElementById('sim-speed-val').textContent = lineSpeed.toFixed(1) + (scale === 'industrial' ? ' m/dk (x4 Hat)' : ' m/dk');
    document.getElementById('sim-temp-val').textContent = bathTemp + ' °C';
    document.getElementById('sim-stretch-val').textContent = stretchRatio + ' %';
    document.getElementById('sim-conc-val').textContent = concentration + ' %';

    const result = simulator.runSimulation({
      methodKey,
      lineSpeed,
      bathTemp,
      stretchRatio,
      concentration,
      oven1Bypassed,
      scale
    });

    // Update Simulator Output Cards
    document.getElementById('res-total-time').textContent = result.totalPanTime + ' dk';
    document.getElementById('res-time-saved').textContent = '%' + result.timeSavedPercent;
    document.getElementById('res-energy-saved').textContent = '%' + result.energySavedPercent;
    document.getElementById('res-initial-s').textContent = '%' + result.initialStabJump;

    document.getElementById('res-strength').textContent = result.mechanics.finalStrength + ' GPa';
    document.getElementById('res-strength-gain').textContent = '(+' + result.mechanics.strengthGainPercent + '%)';
    document.getElementById('res-modulus').textContent = result.mechanics.finalModulus + ' GPa';
    document.getElementById('res-modulus-gain').textContent = '(+' + result.mechanics.modulusGainPercent + '%)';

    // Render / Update Charts
    renderStabilizationChart(result);
    renderTemperatureChart(result);
  }

  function renderStabilizationChart(result) {
    const ctx = document.getElementById('chart-stabilization').getContext('2d');

    const data = {
      labels: result.charts.convTimePoints,
      datasets: [
        {
          label: 'Geleneksel Stabilizasyon (120 dk, 4 Fırın)',
          data: result.charts.convStabDegree,
          borderColor: '#8b9bb4',
          borderWidth: 2.5,
          borderDash: [5, 5],
          backgroundColor: 'rgba(139, 155, 180, 0.05)',
          fill: true,
          tension: 0.3
        },
        {
          label: `PANTreat (${result.method.name}) - ${result.totalPanTime} dk`,
          data: result.charts.convTimePoints.map((t, idx) => {
            const panIdx = result.charts.panTimePoints.findIndex(pt => pt >= t);
            if (panIdx !== -1) {
              return result.charts.panStabDegree[panIdx];
            }
            return 100;
          }),
          borderColor: result.method.color,
          borderWidth: 3.5,
          backgroundColor: result.method.color + '22',
          fill: true,
          tension: 0.35
        }
      ]
    };

    if (charts.stabilization) {
      charts.stabilization.data = data;
      charts.stabilization.update();
    } else {
      charts.stabilization = new Chart(ctx, {
        type: 'line',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#f0f4fc', font: { family: 'Outfit', size: 12 } } },
            tooltip: {
              callbacks: {
                label: (c) => `${c.dataset.label}: S = ${c.raw}%`
              }
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Zaman (Dakika)', color: '#8b9bb4' },
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b9bb4' }
            },
            y: {
              min: 0,
              max: 105,
              title: { display: true, text: 'Stabilizasyon Derecesi S (%)', color: '#8b9bb4' },
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b9bb4' }
            }
          }
        }
      });
    }
  }

  function renderTemperatureChart(result) {
    const ctx = document.getElementById('chart-temperature').getContext('2d');

    const data = {
      labels: result.charts.convTimePoints,
      datasets: [
        {
          label: 'Geleneksel Sıcaklık Profili (°C)',
          data: result.charts.convTempProfile,
          borderColor: '#ff8800',
          borderWidth: 2,
          borderDash: [4, 4],
          fill: false,
          tension: 0.2
        },
        {
          label: 'PANTreat Sıcaklık Profili (°C)',
          data: result.charts.convTimePoints.map((t) => {
            const panIdx = result.charts.panTimePoints.findIndex(pt => pt >= t);
            if (panIdx !== -1) {
              return result.charts.panTempProfile[panIdx];
            }
            return 295;
          }),
          borderColor: '#00f0ff',
          borderWidth: 3,
          fill: false,
          tension: 0.25
        }
      ]
    };

    if (charts.temperature) {
      charts.temperature.data = data;
      charts.temperature.update();
    } else {
      charts.temperature = new Chart(ctx, {
        type: 'line',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#f0f4fc', font: { family: 'Outfit', size: 12 } } }
          },
          scales: {
            x: {
              title: { display: true, text: 'Zaman (Dakika)', color: '#8b9bb4' },
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b9bb4' }
            },
            y: {
              min: 30,
              max: 320,
              title: { display: true, text: 'Sıcaklık (°C)', color: '#8b9bb4' },
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b9bb4' }
            }
          }
        }
      });
    }
  }

  /**
   * Economics Controls & Charting
   */
  function initEconomicsControls() {
    const inputs = ['econ-capacity', 'econ-price', 'econ-energy-cost', 'econ-capex', 'econ-co2-factor'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => updateEconomics());
      }
    });
  }

  function updateEconomics() {
    const capacityTpa = parseFloat(document.getElementById('econ-capacity').value);
    const sellingPriceEuroKg = parseFloat(document.getElementById('econ-price').value);
    const energyCostKwh = parseFloat(document.getElementById('econ-energy-cost').value);
    const capexRetrofitEuro = parseFloat(document.getElementById('econ-capex').value);
    const co2FactorKgKwh = parseFloat(document.getElementById('econ-co2-factor').value);

    document.getElementById('econ-capacity-val').textContent = capacityTpa.toLocaleString() + ' Ton/Yıl';
    document.getElementById('econ-price-val').textContent = sellingPriceEuroKg.toFixed(1) + ' €/kg';
    document.getElementById('econ-energy-cost-val').textContent = energyCostKwh.toFixed(2) + ' €/kWh';
    document.getElementById('econ-capex-val').textContent = capexRetrofitEuro.toLocaleString() + ' €';

    const res = economics.calculate({
      capacityTpa,
      sellingPriceEuroKg,
      energyCostKwh,
      capexRetrofitEuro,
      co2FactorKgKwh
    });

    // Update Output Badges
    document.getElementById('econ-res-annual-savings').textContent = '€ ' + res.grossAnnualSavings.toLocaleString();
    document.getElementById('econ-res-net-savings').textContent = '€ ' + res.netAnnualSavings.toLocaleString();
    document.getElementById('econ-res-saving-per-kg').textContent = '€ ' + res.grossCostSavingPerKg + ' / kg';
    document.getElementById('econ-res-kwh-saved').textContent = (res.energy.totalKwhSavedYear / 1e6).toFixed(2) + ' GWh/Yıl';
    document.getElementById('econ-res-co2-saved').textContent = res.energy.totalCo2SavedTonYear.toLocaleString() + ' Ton CO2/Yıl';
    document.getElementById('econ-res-payback').textContent = res.roi.paybackMonths + ' Ay';

    renderCostBreakdownChart(res);
  }

  function renderCostBreakdownChart(res) {
    const ctx = document.getElementById('chart-cost-breakdown').getContext('2d');

    const data = {
      labels: ['Prekürsör (PAN Lif)', 'Stabilizasyon Enerjisi', 'Karbonizasyon', 'Ön İşlem Kimyasalı', 'Genel İşletme/İşçilik'],
      datasets: [
        {
          label: 'Geleneksel Hat (€/kg CF)',
          data: [
            res.costBreakdown.conventional.precursor,
            res.costBreakdown.conventional.stabilization,
            res.costBreakdown.conventional.carbonization,
            0,
            res.costBreakdown.conventional.overhead
          ],
          backgroundColor: 'rgba(255, 0, 85, 0.75)',
          borderRadius: 6
        },
        {
          label: 'PANTreat Modüler Hat (€/kg CF)',
          data: [
            res.costBreakdown.pantreat.precursor,
            res.costBreakdown.pantreat.stabilization,
            res.costBreakdown.pantreat.carbonization,
            res.costBreakdown.pantreat.pretreatment,
            res.costBreakdown.pantreat.overhead
          ],
          backgroundColor: 'rgba(0, 240, 255, 0.75)',
          borderRadius: 6
        }
      ]
    };

    if (charts.costBreakdown) {
      charts.costBreakdown.data = data;
      charts.costBreakdown.update();
    } else {
      charts.costBreakdown = new Chart(ctx, {
        type: 'bar',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#f0f4fc', font: { family: 'Outfit', size: 12 } } },
            tooltip: {
              callbacks: {
                label: (c) => `${c.dataset.label}: € ${c.raw.toFixed(2)} / kg`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b9bb4', font: { size: 11 } }
            },
            y: {
              title: { display: true, text: 'Birim Maliyet (€ / kg Karbon Elyaf)', color: '#8b9bb4' },
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#8b9bb4' }
            }
          }
        }
      });
    }
  }

  /**
   * Bio-Coating Formulation Engine
   */
  function initBioCoatingControls() {
    const inputs = ['coat-esbo-mass', 'coat-aa-ratio', 'coat-tdi-ratio', 'coat-uv-intensity', 'coat-uv-time'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => updateBioCoating());
      }
    });
  }

  function updateBioCoating() {
    const esboMassGrams = parseFloat(document.getElementById('coat-esbo-mass').value);
    const aaMolarRatio = parseFloat(document.getElementById('coat-aa-ratio').value);
    const tdiHemaRatio = parseFloat(document.getElementById('coat-tdi-ratio').value);
    const uvIntensityMwCm2 = parseFloat(document.getElementById('coat-uv-intensity').value);
    const uvExposureSec = parseFloat(document.getElementById('coat-uv-time').value);

    document.getElementById('coat-esbo-val').textContent = esboMassGrams + ' g';
    document.getElementById('coat-aa-val').textContent = aaMolarRatio.toFixed(2) + ' mol AA / Epoksi';
    document.getElementById('coat-tdi-val').textContent = tdiHemaRatio.toFixed(2) + ' NCO:OH';
    document.getElementById('coat-uv-int-val').textContent = uvIntensityMwCm2 + ' mW/cm²';
    document.getElementById('coat-uv-time-val').textContent = uvExposureSec + ' sn';

    const res = bioCoating.calculateFormulation({
      esboMassGrams,
      aaMolarRatio,
      tdiHemaRatio,
      uvIntensityMwCm2,
      uvExposureSec
    });

    // Update Masses Table
    document.getElementById('coat-res-aa-mass').textContent = res.masses.aaGrams + ' g';
    document.getElementById('coat-res-tdi-mass').textContent = res.masses.tdiHemaGrams + ' g';
    document.getElementById('coat-res-pi-mass').textContent = res.masses.piGrams + ' g';
    document.getElementById('coat-res-total-mass').textContent = res.masses.totalBatchGrams + ' g';

    // Update Properties Badges
    document.getElementById('coat-res-gel').textContent = '%' + res.properties.gelContentPercent;
    document.getElementById('coat-res-hardness').textContent = res.properties.pencilHardness;
    document.getElementById('coat-res-corrosion').textContent = res.properties.corrosionScore + ' / 100';
    document.getElementById('coat-res-adhesion').textContent = res.properties.adhesionClass;
    document.getElementById('coat-res-voc').textContent = res.properties.vocEmissions;

    renderBioRadarChart(res);
  }

  function renderBioRadarChart(res) {
    const ctx = document.getElementById('chart-bio-radar').getContext('2d');

    const data = {
      labels: ['Jel Oranı (%)', 'Kimyasal Direnç (100)', 'Sertlik Skoru', 'Yapışma Gücü', 'UV Hızı'],
      datasets: [
        {
          label: 'Marmara Biyo-Poliüretan Kaplama Özellikleri',
          data: [
            parseFloat(res.properties.gelContentPercent),
            parseFloat(res.properties.corrosionScore),
            88,
            95,
            90
          ],
          backgroundColor: 'rgba(0, 255, 102, 0.25)',
          borderColor: '#00ff66',
          pointBackgroundColor: '#00ff66',
          pointBorderColor: '#fff',
          borderWidth: 2.5
        }
      ]
    };

    if (charts.bioRadar) {
      charts.bioRadar.data = data;
      charts.bioRadar.update();
    } else {
      charts.bioRadar = new Chart(ctx, {
        type: 'radar',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#f0f4fc', font: { family: 'Outfit', size: 12 } } }
          },
          scales: {
            r: {
              min: 0,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.08)' },
              angleLines: { color: 'rgba(255,255,255,0.1)' },
              pointLabels: { color: '#8b9bb4', font: { size: 11 } },
              ticks: { display: false }
            }
          }
        }
      });
    }
  }

  /**
   * Plant Digital Twin Live Telemetry
   */
  function initPlantTwinControls() {
    const inputs = ['twin-speed', 'twin-temp', 'twin-conc', 'twin-stretch'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => updatePlantTwin());
      }
    });
  }

  function updatePlantTwin() {
    const lineSpeed = document.getElementById('twin-speed') ? parseFloat(document.getElementById('twin-speed').value) : 2.5;
    const bathTemp = document.getElementById('twin-temp') ? parseFloat(document.getElementById('twin-temp').value) : 75;
    const concentration = document.getElementById('twin-conc') ? parseFloat(document.getElementById('twin-conc').value) : 4.0;
    const stretchRatio = document.getElementById('twin-stretch') ? parseFloat(document.getElementById('twin-stretch').value) : 8.0;

    const s = plantTwin.updateTelemetry({ lineSpeed, bathTemp, concentration, stretchRatio });

    // Update Telemetry Displays
    const setIf = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setIf('twin-val-speed', s.lineSpeedMPerMin.toFixed(1) + ' m/dk');
    setIf('twin-val-temp', s.bathTempC.toFixed(1) + ' °C');
    setIf('twin-val-conc', '%' + s.actualConcentrationPercent);
    setIf('twin-val-ph', s.pH);
    setIf('twin-val-cond', s.conductivityMs + ' mS/cm');
    setIf('twin-val-turb', s.turbidityNtu + ' NTU');
    setIf('twin-val-dosing', s.dosingPumpRateMlMin + ' ml/dk');
    setIf('twin-val-power', s.heatingPowerKw + ' kW');
    setIf('twin-val-tension', s.omegaTensionN + ' N');
    setIf('twin-val-pressure', s.filterPressureBar + ' Bar');
    setIf('twin-val-filter-status', s.filterStatus);
  }

  /**
   * Consortium Roadmap & Work Packages Render
   */
  function initConsortiumView() {
    const wpListEl = document.getElementById('consortium-wp-list');
    if (!wpListEl) return;

    let html = '';
    PANTREAT_CONFIG.workPackages.forEach(wp => {
      html += `
        <div class="glass-card wp-card">
          <div class="wp-header">
            <span class="wp-badge">${wp.id}</span>
            <h3 class="wp-title">${wp.title}</h3>
            <span class="wp-lead">Lider: <strong>${wp.lead}</strong></span>
          </div>
          <div class="wp-body">
            <p class="wp-desc">${wp.description}</p>
            <div class="wp-meta">
              <span>📅 Ay ${wp.startMonth} - ${wp.endMonth} (${wp.duration} Ay)</span>
              <span>👥 Efor: <strong>${wp.effortPM} Kişi-Ay</strong></span>
            </div>
            <div class="wp-deliverables">
              <strong>Teslimatlar:</strong>
              <ul>
                ${wp.deliverables.map(d => `<li>📦 ${d}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    });
    wpListEl.innerHTML = html;

    // Render Partners List
    const partnersListEl = document.getElementById('consortium-partners-list');
    if (partnersListEl) {
      let pHtml = '';
      PANTREAT_CONFIG.partners.forEach(p => {
        pHtml += `
          <div class="glass-card partner-card">
            <div class="partner-header">
              <span class="partner-flag">${p.flag}</span>
              <div>
                <h4 class="partner-name">${p.name} (${p.shortName})</h4>
                <span class="partner-type">${p.type} • Yürütücü (PI): <strong>${p.pi}</strong></span>
              </div>
            </div>
            <p class="partner-role">${p.roleDescription}</p>
            <div class="partner-stats">
              <span>Bütçe: <strong>${p.budget.toLocaleString()} €</strong></span>
              <span>Efor: <strong>${p.effortPM} Kişi-Ay</strong></span>
            </div>
          </div>
        `;
      });
      partnersListEl.innerHTML = pHtml;
    }
  }

  /**
   * Export Handlers (JSON / CSV / Print PDF)
   */
  function initExportHandlers() {
    const btnJson = document.getElementById('btn-export-json');
    if (btnJson) {
      btnJson.addEventListener('click', () => {
        const report = {
          project: PANTREAT_CONFIG.project,
          timestamp: new Date().toISOString(),
          simulatorParams: {
            method: document.getElementById('sim-method').value,
            lineSpeed: document.getElementById('sim-speed').value,
            bathTemp: document.getElementById('sim-temp').value,
            stretchRatio: document.getElementById('sim-stretch').value
          },
          economicsSummary: economics.calculate({
            capacityTpa: parseFloat(document.getElementById('econ-capacity').value),
            sellingPriceEuroKg: parseFloat(document.getElementById('econ-price').value)
          }),
          bioCoatingSummary: bioCoating.calculateFormulation()
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "PANTreat_Simulation_Report.json");
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
      });
    }

    const btnPrint = document.getElementById('btn-export-print');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }
  }
});
