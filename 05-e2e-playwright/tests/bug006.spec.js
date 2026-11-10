const { test, expect } = require("@playwright/test");

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("BUG-006: con un token alterado el dashboard debe redirigir al login", async ({ page }) => {
  test.skip(!process.env.ADMIN_PASSWORD, "Falta la variable ADMIN_PASSWORD");
  test.fail(true, "BUG-006: hoy el dashboard no redirige al login con un token alterado");
  

  await page.goto(`${BASE_URL}/login`);
  await page.getByRole("textbox", { name: "conductor@tuempresa" }).fill("admin@alenxo");
  await page.getByRole("textbox", { name: "••••" }).fill(process.env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "INICIAR SESIÓN" }).click();
  await page.waitForURL(/dashboard/);

  await page.evaluate(() => {
    const token = localStorage.getItem("token");
    localStorage.setItem("token", token.slice(0, -5) + "XXXXX");
  });
  await page.reload();

  await expect(page).toHaveURL(/login/, { timeout: 10000 });
});