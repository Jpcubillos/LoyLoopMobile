const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const assert = require("node:assert/strict");

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  fs.mkdirSync(".design-reference/qa", { recursive: true });
  try {
    await page.goto("http://localhost:8087", {
      waitUntil: "networkidle",
      timeout: 120000,
    });
    await page
      .getByText("Recomendados", { exact: false })
      .first()
      .waitFor({ timeout: 90000 });
    await page.screenshot({ path: ".design-reference/qa/home.png" });
    assert.equal(
      await page.getByRole("tab").count(),
      4,
      "Main navigation has four content sections",
    );
    await page.getByRole("tab", { name: "Comercios", exact: true }).click();
    await page
      .getByRole("tab", { name: "Mis comercios", exact: true })
      .waitFor();
    await page.screenshot({ path: ".design-reference/qa/commerces.png" });
    await page
      .getByRole("textbox", { name: "Buscar en mis comercios…" })
      .fill("cafe");
    await page.getByRole("button", { name: /Café Central.*Cafés/ }).waitFor();
    assert.equal(
      await page.getByText("Barbería Norte", { exact: true }).count(),
      0,
    );
    await page.getByRole("button", { name: "Limpiar búsqueda" }).click();
    await page.getByRole("tab", { name: "Explorar", exact: true }).click();
    await page.getByText("Comercios destacados", { exact: true }).waitFor();
    await page.screenshot({ path: ".design-reference/qa/explore.png" });
    await page
      .getByRole("button", { name: /Burger House.*Restaurantes/ })
      .click();
    await page
      .getByRole("button", { name: "Unirme al comercio", exact: true })
      .first()
      .waitFor();
    await page.screenshot({ path: ".design-reference/qa/visitor.png" });
    const visitorUrl = page.url();
    await page
      .getByRole("button", { name: "Unirme al comercio", exact: true })
      .first()
      .click();
    await page.getByText("Miembro activo", { exact: true }).waitFor();
    assert.equal(
      page.url(),
      visitorUrl,
      "Joining updates the same detail screen",
    );
    await page
      .getByRole("button", { name: "Mostrar tarjeta de sellos" })
      .click();
    await page.getByText("Tu tarjeta de sellos", { exact: true }).waitFor();
    await page.screenshot({ path: ".design-reference/qa/stamps.png" });
    await page
      .getByRole("button", { name: "Ocultar tarjeta de sellos" })
      .click();
    assert.equal(
      await page.getByText("Tu tarjeta de sellos", { exact: true }).count(),
      0,
    );
    await page.goto("http://localhost:8087/comercio/cafe-central", {
      waitUntil: "networkidle",
    });
    await page.getByText("Miembro activo", { exact: true }).waitFor();
    await page.screenshot({ path: ".design-reference/qa/commerce.png" });
    await page
      .getByRole("button", { name: /15% de descuento.*Disponible/ })
      .click();
    await page
      .getByRole("button", { name: "Reclamar beneficio", exact: true })
      .waitFor();
    await page.screenshot({ path: ".design-reference/qa/benefit-detail.png" });
    await page
      .getByRole("button", { name: "Reclamar beneficio", exact: true })
      .click();
    await page
      .getByText("Código para ingresar manualmente", { exact: true })
      .waitFor();
    await page.screenshot({ path: ".design-reference/qa/claim.png" });
    assert.equal(
      await page.getByText("¡Beneficio aplicado!", { exact: true }).count(),
      0,
    );
    await page
      .getByRole("button", { name: "Simular validación · demo", exact: true })
      .click();
    await page.getByText("¡Beneficio aplicado!", { exact: true }).waitFor();
    await page.screenshot({ path: ".design-reference/qa/success.png" });
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
    await page.goto("http://localhost:8087/recompensas", {
      waitUntil: "networkidle",
    });
    await page.getByText("Beneficios disponibles", { exact: true }).waitFor();
    await page.screenshot({ path: ".design-reference/qa/benefits.png" });
    await page.getByRole("tab", { name: "Promociones", exact: true }).click();
    await page
      .getByRole("button", { name: /2x puntos hoy/ })
      .first()
      .waitFor();
    await page.getByRole("tab", { name: "Misiones", exact: true }).click();
    await page.getByText("Misiones activas", { exact: true }).waitFor();
    await page.getByRole("tab", { name: "Perfil", exact: true }).click();
    await page.getByText("Tu LoyLevel ✦", { exact: true }).waitFor();
    await page.screenshot({ path: ".design-reference/qa/profile.png" });
    await page.getByRole("button", { name: /Información personal/ }).click();
    await page.getByRole("button", { name: /Nombre completo/ }).click();
    await page
      .getByRole("textbox", { name: "Nombre completo" })
      .fill("María Prueba");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByText("Información actualizada", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
    await page.getByText("María Prueba", { exact: true }).first().waitFor();
    await page.screenshot({ path: ".design-reference/qa/personal.png" });
    await page.goto("http://localhost:8087/escanear", {
      waitUntil: "networkidle",
    });
    await page
      .getByRole("textbox", { name: "Enlace o código del comercio" })
      .fill("https://example.com/unsafe");
    await page.getByRole("button", { name: "Buscar comercio" }).click();
    await page
      .getByText("Este QR no corresponde a un comercio de LoyLoop.", {
        exact: true,
      })
      .waitFor();
    await page
      .getByRole("textbox", { name: "Enlace o código del comercio" })
      .fill("cafe-central");
    await page.getByRole("button", { name: "Buscar comercio" }).click();
    await page.getByText("Miembro activo", { exact: true }).waitFor();
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto("http://localhost:8087", { waitUntil: "networkidle" });
    await page.getByText("Recomendados", { exact: false }).first().waitFor();
    await page.screenshot({ path: ".design-reference/qa/home-small.png" });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      "No page overflow at 320px",
    );
    console.log(
      "PASS: 4 main sections, search, internal tabs, joining, stamps, QR confirmation, profile edits, QR input, 320px layout",
    );
    console.log("ERRORS", JSON.stringify(errors));
    assert.equal(errors.length, 0);
  } finally {
    await context.close();
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
