# BUG-006: Con un token alterado el dashboard no redirige al login y queda sin datos

- **Fecha:** 2026-11-04
- **Módulo:** Sesión / Frontend (interceptor de peticiones)
- **Severidad:** Baja
- **Prioridad:** Baja
- **Entorno:** local, Chrome, Windows
- **Caso relacionado:** CP-LOGIN-014

## Precondiciones
- Sesión iniciada como admin@alenxo en /dashboard.

## Pasos para reproducir
1. Abrir DevTools > Application > Local Storage > http://localhost:5173.
2. Editar el valor de la clave "token" cambiando las últimas letras.
3. Recargar la página con F5.

## Resultado esperado
El sistema detecta la sesión inválida y redirige a /login.

## Resultado obtenido
La ruta se mantiene en /dashboard. La consola muestra errores 422 (UNPROCESSABLE ENTITY) en todas las peticiones (analytics/dashboard, analytics/operational, settings, plans/modules, notifications/pending-counts, plans/my-permissions, onboarding/tasks, analytics/warehouse). El usuario no recibe ningún aviso.

## Evidencia
- Consola del navegador con las peticiones 422.
- Network (sin filtro): peticiones a warehouse, tasks y pending-counts con Status 422. pending-counts se repite periódicamente (el dashboard lo consulta cada cierto tiempo), de modo que cada ciclo genera otro 422 sin que el front reaccione.
- Comparación: con el token borrado (variante A), el sistema sí redirige a /login.
- Consola del navegador con las peticiones 422.


## Notas
- Causa probable (sin confirmar): el front solo redirige ante respuestas 401, no ante 422.
- Por defecto la librería JWT del backend responde 422 a un token mal formado y 401 a uno vencido. No se verificó si un vencimiento real redirige correctamente.
- Corrección sugerida: tratar también 422 de tokens inválidos como sesión inválida y redirigir al login.