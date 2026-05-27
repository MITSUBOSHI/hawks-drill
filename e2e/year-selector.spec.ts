import { test, expect } from "@playwright/test";
import { registeredYears } from "../src/constants/player";

const yearsDesc = [...registeredYears].sort((a, b) => b - a);
const maxYear = yearsDesc[0];

test.describe("YearSelector", () => {
  test("各ページで YearSelector が表示される", async ({ page }) => {
    const pages = [
      `/player-directory/${maxYear}`,
      `/number-drill/${maxYear}`,
      `/lineup-maker/${maxYear}`,
      `/uniform-view/${maxYear}`,
      `/number-count/${maxYear}`,
    ];

    for (const url of pages) {
      await page.goto(url);
      const button = page.getByRole("button", { name: /年を選択/ });
      await expect(button).toBeVisible();
      await expect(button).toContainText(String(maxYear));
    }
  });

  test("全年度のオプションが表示される", async ({ page }) => {
    await page.goto(`/player-directory/${maxYear}`);

    // ドロップダウンを開く
    await page.getByRole("button", { name: /年を選択/ }).click();

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();

    // 登録されている全年度のオプション
    for (const year of yearsDesc) {
      await expect(
        listbox.getByRole("option", { name: String(year) }),
      ).toBeVisible();
    }

    // 最新年度が選択状態
    await expect(
      listbox.getByRole("option", { name: String(maxYear) }),
    ).toHaveAttribute("aria-selected", "true");
  });

  test("年度を切り替えると対応するページに遷移する", async ({ page }) => {
    test.skip(
      yearsDesc.length < 2,
      "登録年度が1つだけのため切り替え先がない",
    );
    const targetYear = yearsDesc[1];

    await page.goto(`/player-directory/${maxYear}`);

    await page.getByRole("button", { name: /年を選択/ }).click();
    await page.getByRole("option", { name: String(targetYear) }).click();

    await page.waitForURL(`**/player-directory/${targetYear}`);
    await expect(
      page.getByRole("heading", { name: "選手名鑑" }),
    ).toBeVisible();
  });
});
