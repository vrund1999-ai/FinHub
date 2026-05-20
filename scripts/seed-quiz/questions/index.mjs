// Question pool aggregator. Each category file exports a `category` const and
// an `items` array of tuples; this module hydrates them into the object shape
// the build-migration script expects.
//
// Tuple layout:
//   [source_key, difficulty, prompt, choices[], correct_index, explanation, glossary_slug?]
//
// glossary_slug is optional. When present it must exist in the glossary_terms
// table (0003 seed) or the migration insert will fail the FK check.

import { category as catInvesting, items as itemsInvesting } from "./01-investing-basics.mjs";
import { category as catStocks, items as itemsStocks } from "./02-stocks-equities.mjs";
import { category as catBonds, items as itemsBonds } from "./03-bonds-fixed-income.mjs";
import { category as catMarket, items as itemsMarket } from "./04-market-structure.mjs";
import { category as catStatements, items as itemsStatements } from "./05-financial-statements.mjs";
import { category as catRatios, items as itemsRatios } from "./06-ratios-valuation.mjs";
import { category as catMacro, items as itemsMacro } from "./07-macro-monetary-policy.mjs";
import { category as catOptions, items as itemsOptions } from "./08-options-derivatives.mjs";
import { category as catEtfs, items as itemsEtfs } from "./09-etfs-funds.mjs";
import { category as catTechnical, items as itemsTechnical } from "./10-technical-analysis.mjs";
import { category as catCorporate, items as itemsCorporate } from "./11-corporate-actions.mjs";
import { category as catCrypto, items as itemsCrypto } from "./12-crypto.mjs";
import { category as catBehavioral, items as itemsBehavioral } from "./13-behavioral-finance.mjs";
import { category as catTaxes, items as itemsTaxes } from "./14-taxes-retirement.mjs";
import { category as catRisk, items as itemsRisk } from "./15-risk-portfolio.mjs";

const SECTIONS = [
  [catInvesting, itemsInvesting],
  [catStocks, itemsStocks],
  [catBonds, itemsBonds],
  [catMarket, itemsMarket],
  [catStatements, itemsStatements],
  [catRatios, itemsRatios],
  [catMacro, itemsMacro],
  [catOptions, itemsOptions],
  [catEtfs, itemsEtfs],
  [catTechnical, itemsTechnical],
  [catCorporate, itemsCorporate],
  [catCrypto, itemsCrypto],
  [catBehavioral, itemsBehavioral],
  [catTaxes, itemsTaxes],
  [catRisk, itemsRisk],
];

export function allQuestions() {
  const out = [];
  for (const [category, items] of SECTIONS) {
    for (const t of items) {
      out.push({
        source_key: t[0],
        difficulty: t[1],
        prompt: t[2],
        choices: t[3],
        correct_index: t[4],
        explanation: t[5],
        category,
        glossary_slug: t[6] ?? null,
      });
    }
  }
  return out;
}
