import http from "k6/http";
import { check } from "k6";
import { Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:5000";

const RUTAS = [
  "/api/notifications/pending-counts",
  "/api/analytics/dashboard",
  "/api/analytics/operational",
  "/api/analytics/warehouse",
  "/api/services",
  "/api/tower/live",
  "/api/employees",
  "/api/employees/payroll-summary",
  "/api/finance/summary",
  "/api/settings",
];

const tiempos = {};
RUTAS.forEach((ruta) => {
  tiempos[ruta] = new Trend("t" + ruta.replace(/[^a-zA-Z0-9]/g, "_"), true);
});

export const options = {
  vus: 1,
  iterations: 5,
};

export function setup() {
  const respuesta = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: "admin@alenxo",
      password: __ENV.ADMIN_PASSWORD,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  if (respuesta.status !== 200) {
    throw new Error(`El login de preparación falló con ${respuesta.status}`);
  }
  return { token: respuesta.json("access_token") };
}

export default function (datos) {
  RUTAS.forEach((ruta) => {
    const respuesta = http.get(`${BASE_URL}${ruta}`, {
      headers: { Authorization: `Bearer ${datos.token}` },
    });
    check(respuesta, { [`${ruta} responde 200`]: (r) => r.status === 200 });
    if (respuesta.status === 200) {
      tiempos[ruta].add(respuesta.timings.duration);
    }
  });
}