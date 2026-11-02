# Casos de prueba: Login

| ID | Título | Precondición | Pasos | Esperado | Obtenido | Estado | Prioridad |
|----|--------|--------------|-------|----------|----------|--------|-----------|
| CP-LOGIN-001 | Login exitoso con usuario válido | Usuario admin activo | 1. Abrir /login 2. Ingresar usuario 3. Ingresar clave 4. Clic en Entrar | Redirige a /dashboard | | | Alta |
| CP-LOGIN-002 | Login con contraseña incorrecta | Usuario admin activo | 1. Abrir /login 2. Ingresar usuario válido 3. Ingresar clave incorrecta 4. Clic en Entrar | Muestra mensaje "Usuario o contraseña incorrectos" y permanece en /login | | | Alta |
| CP-LOGIN-003 | Login con usuario inexistente | El usuario no existe en el sistema | 1. Abrir /login 2. Ingresar usuario no registrado 3. Ingresar cualquier clave 4. Clic en Entrar | Muestra mensaje genérico "Usuario o contraseña incorrectos" (sin revelar si el usuario existe) y permanece en /login | | | Alta |
| CP-LOGIN-004 | Login con campos vacíos | Ninguna | 1. Abrir /login 2. Dejar usuario y clave vacíos 3. Clic en Entrar | Se marcan los campos como obligatorios y no se envía el formulario | | | Media |
| CP-LOGIN-005 | Login con usuario inactivo | Usuario existente con estado inactivo | 1. Abrir /login 2. Ingresar usuario inactivo 3. Ingresar clave correcta 4. Clic en Entrar | Muestra mensaje "Cuenta inactiva" y no permite el acceso | | | Media |