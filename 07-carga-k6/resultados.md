# Resultados de pruebas de carga (k6)

Entorno: notebook local, backend Flask en modo debug, base casi vacía (empresa de prueba).
Límite de peticiones apagado con RATELIMIT_ENABLED=false (solo en la terminal de pruebas).
Los tiempos sirven para comparar rutas entre sí, no para prometer capacidad de producción.

## Línea base (1 usuario)
| Ruta | Mediana | p(95) |
|------|---------|-------|
| POST /api/auth/login | 285 ms | 809 ms |
| GET /api/notifications/pending-counts | 12 ms | 71 ms |

## Rampa hasta 20 usuarios virtuales (40 s, sin pausas)
| Ruta | Peticiones | Errores | Mediana | p(95) | Máximo | Req/s |
|------|-----------|---------|---------|-------|--------|-------|
| pending-counts | 3.622 | 0 % | 97 ms | 202 ms | 653 ms | ~89 |
| analytics/dashboard | 1.256 | 0 % | 292 ms | 571 ms | 812 ms | ~31 |
| analytics/dashboard (con 500 servicios) | 777 | 0 % | 433 ms | 1,03 s | 1,42 s | ~19 |

## Con el límite de peticiones encendido (200 por hora por IP)
- Rampa sobre pending-counts: ~200 respuestas 200 y ~7.700 respuestas 429 (97 % rechazadas).
- Rechazar es barato: no se degrada el servidor.

## Observaciones
- Degradación gradual, sin errores, hasta 20 usuarios virtuales.
- El rendimiento por segundo parece ser aproximadamente 1 / tiempo de una sola petición (hipótesis, sin confirmar la causa).
- El login cuesta ~285 ms por bcrypt, a propósito.
- Falta medir con volumen de datos realista y con pausas entre peticiones.