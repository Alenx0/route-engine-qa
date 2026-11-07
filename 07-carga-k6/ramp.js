import http from "k6/http";
import { check } from "k6";
import { Counter } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:5000";
const respuestas_200 = new Counter("respuestas_200");
const respuestas_429 = new Counter("respuestas_429");

export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "20s", target: 20 },
    { duration: "10s", target: 0 },
  ],
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
    const respuesta = http.get(`${BASE_URL}/api/analytics/dashboard`, {
    headers: { Authorization: `Bearer ${datos.token}` },
  });

  if (respuesta.status === 200) respuestas_200.add(1);
  if (respuesta.status === 429) respuestas_429.add(1);

  check(respuesta, {
    "responde 200 o 429": (r) => r.status === 200 || r.status === 429,
  });
}