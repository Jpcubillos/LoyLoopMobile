const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const vm = require("node:vm");
const target = "src/lib/loyalty-rules.ts";
const moduleRef = { exports: {} };
if (fs.existsSync(target)) {
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(target, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    { exports: moduleRef.exports, module: moduleRef, URL, Date },
  );
}
const rules = moduleRef.exports;

test("only completed conditions unlock member rewards; fidelity points are not spent", () => {
  assert.equal(typeof rules.canClaimOffer, "function");
  const offer = { kind: "reward", requiredPoints: 250, requiredStamps: 0 };
  assert.equal(
    rules.canClaimOffer(offer, { isMember: false, points: 500, stamps: 10 }),
    false,
  );
  assert.equal(
    rules.canClaimOffer(offer, { isMember: true, points: 180, stamps: 10 }),
    false,
  );
  const member = { isMember: true, points: 250, stamps: 10 };
  assert.equal(rules.canClaimOffer(offer, member), true);
  assert.equal(member.points, 250);
  assert.equal(
    rules.canClaimOffer(
      { kind: "reward", requiredStamps: 10 },
      { ...member, stamps: 7 },
    ),
    false,
  );
  assert.equal(rules.canClaimOffer({ kind: "mission" }, member), false);
});
test("expired and future promotions cannot be claimed", () => {
  assert.equal(typeof rules.canClaimOffer, "function");
  const member = { isMember: true, points: 0, stamps: 0 };
  assert.equal(
    rules.canClaimOffer({ kind: "promotion", endsAt: "2020-01-01" }, member),
    false,
  );
  assert.equal(
    rules.canClaimOffer({ kind: "promotion", startsAt: "2099-01-01" }, member),
    false,
  );
});
test("business QR parser rejects unrelated and unsafe links", () => {
  assert.equal(typeof rules.parseCommerceQr, "function");
  assert.equal(
    rules.parseCommerceQr("https://loy-loop.vercel.app/comercio/cafe-central"),
    "cafe-central",
  );
  assert.equal(
    rules.parseCommerceQr("loyloop://comercio/cafe-central"),
    "cafe-central",
  );
  assert.equal(rules.parseCommerceQr("cafe-central"), "cafe-central");
  assert.equal(
    rules.parseCommerceQr("https://evil.example/comercio/cafe-central"),
    null,
  );
  assert.equal(rules.parseCommerceQr("javascript:alert(1)"), null);
  assert.equal(
    rules.parseCommerceQr("https://loy-loop.vercel.app/comercio/../admin"),
    null,
  );
});
test("claim success requires merchant approval even after local expiration", () => {
  assert.equal(typeof rules.getClaimState, "function");
  assert.equal(rules.getClaimState("pending", "2020-01-01"), "expired");
  assert.equal(rules.getClaimState("approved", "2020-01-01"), "approved");
  assert.equal(rules.getClaimState("rejected", "2099-01-01"), "rejected");
  assert.equal(rules.getClaimState("pending", "2099-01-01"), "pending");
  assert.equal(rules.getClaimState("unknown", "2099-01-01"), "pending");
});
