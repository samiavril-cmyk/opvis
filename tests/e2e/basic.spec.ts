import { test, expect } from '@playwright/test'

test('loads app and shows UI', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await expect(page.getByText('OP Viz Doc')).toBeVisible()
})
