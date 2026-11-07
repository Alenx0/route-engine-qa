import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:5000";

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1000"],
  },
};

export default function () {
  const respuesta = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: "admin@alenxo",
      password: __ENV.ADMIN_PASSWORD,
    }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(respuesta, {
    "status es 200": (r) => r.status === 200,
  });
}