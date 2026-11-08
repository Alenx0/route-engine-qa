import http from "k6/http";
import { check } from "k6";
import { Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:5000";

const hoy = new Date();
const anio = hoy.getFullYear();
const mes = String(hoy.getMonth() + 1).padStart(2, "0");
const dia = String(hoy.getDate()).padStart(2, "0");

const VARIANTES = {
  sin_fechas: "",
  este_mes: `?start_date=${anio}-${mes}-01&end_date=${anio}-${mes}-${dia}`,
  este_anio: `?start_date=${anio}-01-01&end_date=${anio}-${mes}-${dia}`,
};

const tiempos = {};
Object.keys(VARIANTES).forEach((nombre) => {
  tiempos[nombre] = new Trend("dash_" + nombre, true);
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
  Object.keys(VARIANTES).forEach((nombre) => {
    const respuesta = http.get(
      `${BASE_URL}/api/analytics/dashboard${VARIANTES[nombre]}`,
      { headers: { Authorization: `Bearer ${datos.token}` } }
    );
    check(respuesta, {
      [`${nombre} responde 200`]: (r) => r.status === 200,
    });
    if (respuesta.status === 200) {
      tiempos[nombre].add(respuesta.timings.duration);
    }
  });
}