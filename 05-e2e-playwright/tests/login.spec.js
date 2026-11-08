const { test, expect } = require("@playwright/test");

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("clave incorrecta muestra el mensaje y permanece en /login", async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);

  await page.getByRole("textbox", { name: "conductor@tuempresa" }).fill("admin@alenxo");
  await page.getByRole("textbox", { name: "••••" }).fill("ClaveMala123");
  await page.getByRole("button", { name: "INICIAR SESIÓN" }).click();

  await expect(page.getByText("Credenciales inválidas")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});