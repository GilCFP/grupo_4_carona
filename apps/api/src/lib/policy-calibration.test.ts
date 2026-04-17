import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOfferRange,
  fallbackAction,
  isFavorableOutcome,
  matchesRule,
  riskBandFromLossProbability
} from "./policy-calibration.js";
import { makeBucket, makeHistoricalRow } from "../test-helpers/policy-fixtures.js";

test("isFavorableOutcome distingue Êxito de Não Êxito", () => {
  assert.equal(isFavorableOutcome("Êxito"), true);
  assert.equal(isFavorableOutcome("Exito"), true);
  assert.equal(isFavorableOutcome("Não Êxito"), false);
  assert.equal(isFavorableOutcome("Nao Exito"), false);
});

test("buildOfferRange aplica clamp e centraliza o target no intervalo final", () => {
  const offerRange = buildOfferRange(10000, "high", 6000, 7000);

  assert.deepEqual(offerRange, {
    min: 6000,
    target: 6500,
    max: 7000
  });
});

test("riskBandFromLossProbability respeita os thresholds do MVP", () => {
  assert.equal(riskBandFromLossProbability(0.8), "high");
  assert.equal(riskBandFromLossProbability(0.55), "medium");
  assert.equal(riskBandFromLossProbability(0.2), "low");
});

test("fallbackAction recomenda acordo quando custo esperado supera a oferta alvo", () => {
  const agreementBucket = makeBucket({
    lossRate: 0.9,
    medianCondemnationBrl: 10000,
    expectedJudicialCost: 9000
  });
  const defenseBucket = makeBucket({
    lossRate: 0.2,
    medianCondemnationBrl: 10000,
    expectedJudicialCost: 2000
  });

  assert.equal(fallbackAction(agreementBucket), "agreement");
  assert.equal(fallbackAction(defenseBucket), "defense");
});

test("matchesRule valida igualdade nas features estruturadas", () => {
  const row = makeHistoricalRow({
    features: {
      contractPresent: false,
      creditProofPresent: false,
      claimAmountBand: "high",
      hasFullDocumentation: false
    }
  });
  const rule = {
    ruleKey: "agreement_test_rule",
    priority: 10,
    title: "Regra de teste",
    conditionSummary: "Teste",
    conditionJson: {
      all: [
        { field: "contractPresent", operator: "eq" as const, value: false },
        { field: "creditProofPresent", operator: "eq" as const, value: false },
        { field: "claimAmountBand", operator: "eq" as const, value: "high" }
      ]
    },
    action: "agreement" as const,
    explanation: "Teste"
  };

  assert.equal(matchesRule(row, rule), true);
});
