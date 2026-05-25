"use client";

import { CSSProperties, useEffect, useState } from "react";

type MetricKey = "vmg" | "boatSpeed" | "heel" | "rudder";

type Metric = {
  key: MetricKey;
  label: string;
  status: string;
  value: string;
  unit: string;
  gauge: number;
  active: boolean;
};

type HudState = {
  clock: string;
  tws: number;
  targetVMG: string;
  efficiencyScore: number;
  metrics: Metric[];
};

const initialMetrics: Metric[] = [
  { key: "vmg", label: "vmg", status: "lock", value: "0.00", unit: "kts", gauge: 0, active: false },
  { key: "boatSpeed", label: "boat speed", status: "opt", value: "0.00", unit: "kts", gauge: 0, active: false },
  { key: "heel", label: "heel", status: "bal", value: "0.0", unit: "deg", gauge: 0, active: false },
  { key: "rudder", label: "rudder", status: "neu", value: "0.0", unit: "deg", gauge: 0, active: false }
];

function clampGauge(value: number) {
  return Math.min(100, Math.max(0, value));
}

function calculateHud(tws: number): HudState {
  const t = Date.now() / 1000;

  const targetVMG = tws * 0.35 + 1.2;
  const surgeAmp = tws * 0.05;
  const baseBoatSpeed = tws * 0.45 + 0.8;
  const boatSpeed = baseBoatSpeed + Math.sin(t * 0.8) * surgeAmp + Math.random() * 0.05;

  const vmgEfficiency = 0.88 - tws * 0.005;
  const vmg = boatSpeed * vmgEfficiency;

  const targetHeel = 5 + tws * 0.4;
  const heel = targetHeel + Math.sin(t * 0.8) * 1.5;
  const rudder = tws * 0.08 + Math.abs(Math.sin(t * 1.5) * (tws * 0.1));

  const vmgActive = vmg >= targetVMG * 0.95;
  const boatSpeedActive = boatSpeed >= baseBoatSpeed * 0.98;
  const heelActive = heel >= targetHeel - 2 && heel <= targetHeel + 2;
  const rudderActive = rudder < tws * 0.15;
  const activeCount = [vmgActive, boatSpeedActive, heelActive, rudderActive].filter(Boolean).length;

  return {
    clock: new Date().toLocaleTimeString(),
    tws,
    targetVMG: targetVMG.toFixed(2),
    efficiencyScore: (activeCount / 4) * 100,
    metrics: [
      {
        key: "vmg",
        label: "vmg",
        status: "lock",
        value: vmg.toFixed(2),
        unit: "kts",
        gauge: clampGauge((vmg / 12) * 100),
        active: vmgActive
      },
      {
        key: "boatSpeed",
        label: "boat speed",
        status: "opt",
        value: boatSpeed.toFixed(2),
        unit: "kts",
        gauge: clampGauge((boatSpeed / 15) * 100),
        active: boatSpeedActive
      },
      {
        key: "heel",
        label: "heel",
        status: "bal",
        value: Math.abs(heel).toFixed(1),
        unit: "deg",
        gauge: clampGauge((heel / 20) * 100),
        active: heelActive
      },
      {
        key: "rudder",
        label: "rudder",
        status: "neu",
        value: rudder.toFixed(1),
        unit: "deg",
        gauge: clampGauge((rudder / 8) * 100),
        active: rudderActive
      }
    ]
  };
}

export function TelemetryHud() {
  const [tws, setTws] = useState(10);
  const [hud, setHud] = useState<HudState>({
    clock: "00:00:00",
    tws: 10,
    targetVMG: "0.00",
    efficiencyScore: 0,
    metrics: initialMetrics
  });

  useEffect(() => {
    setHud(calculateHud(tws));
    const interval = window.setInterval(() => {
      setHud(calculateHud(tws));
    }, 50);

    return () => window.clearInterval(interval);
  }, [tws]);

  return (
    <section className="telemetry container" aria-label="Sailing telemetry" data-reveal>
      <div className="telemetry__top">
        <span>ilca 7 // tactical_sensors</span>
        <span>{hud.clock}</span>
      </div>
      <div className="metric-grid">
        {hud.metrics.map((metric) => (
          <article className="metric" key={metric.key}>
            <div>
              <span>{metric.label}</span>
              <span className={metric.active ? "status-active" : undefined}>
                {metric.status} <i />
              </span>
            </div>
            <p>
              {metric.value} <small>{metric.unit}</small>
            </p>
            <b style={{ "--gauge": `${metric.gauge}%` } as CSSProperties} />
          </article>
        ))}
      </div>
      <div className="wind">
        <span>wind speed (tws):</span>
        <input
          aria-label="Wind speed"
          max={25}
          min={4}
          onChange={(event) => setTws(Number(event.target.value))}
          type="range"
          value={tws}
        />
        <span>{hud.tws} kt</span>
      </div>
      <div className="telemetry__bottom">
        <span>
          efficiency: <strong>{hud.efficiencyScore}%</strong>
        </span>
        <span>target vmg: {hud.targetVMG} kts</span>
      </div>
    </section>
  );
}
