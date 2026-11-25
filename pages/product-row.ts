import type { Locator, Page } from '@playwright/test';

export function findProductRow(page: Page, rows: Locator, productName: string): Locator {
  const exactName = page.locator(
    `xpath=.//*[@data-test="inventory-item-name" and normalize-space(.)=${xpathString(productName)}]`,
  );

  return rows.filter({ has: exactName });
}

function xpathString(value: string): string {
  if (!value.includes('"')) {
    return `"${value}"`;
  }

  const quotedParts = value.split('"').map(part => `"${part}"`);
  return `concat(${quotedParts.join(`, '"', `)})`;
}
