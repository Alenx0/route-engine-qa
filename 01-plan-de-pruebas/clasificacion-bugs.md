| Bug | Resumen | Severidad (daño) | Prioridad (urgencia) | Por qué |
|-----|---------|------------------|----------------------|---------|
| BUG-002 | El tiempo de respuesta del login delata si un usuario existe | Media | Baja | Permite enumerar usuarios (observado: ~28 ms vs ~313 ms). Atenuante: límite de 10 intentos por minuto. |
| BUG-003 | Un correo de contacto choca con el usuario de otra cuenta | Media | Media | Un usuario legítimo no puede entrar con su correo de contacto (observado). No se vieron datos ajenos. |
| BUG-004 | Una clave de más de 72 bytes provoca un 500 | Media | Media | Falla una petición, el servidor sigue operativo (observado). Además delata usuarios reales. Corrección simple. |
| BUG-005 | El registro dice que envió el correo aunque falló | Baja | Media | El usuario queda esperando un correo que no llegó. No es de seguridad. |
| BUG-006 | Con un token alterado el dashboard no redirige al login | Baja | Baja | El servidor rechaza todo con 422 y no se muestran datos (observado). Queda sin verificar si un token vencido de verdad se comporta igual. |