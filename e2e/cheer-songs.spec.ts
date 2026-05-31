import { test, expect } from "@playwright/test";
import team from "../src/config/team.config.json";

test.describe("応援歌", () => {
  test.skip(!team.features.cheerSongs, "cheer songs feature is disabled");
  test("ページが表示される", async ({ page }) => {
    await page.goto("/cheer-songs/2026");

    await expect(
      page.getByRole("heading", { name: "応援歌", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /年を選択/ })).toBeVisible();
    await expect(page.getByText(/ふりがな(ON|OFF)/)).toBeVisible();
  });

  test("カテゴリタブで絞り込みができる", async ({ page }) => {
    await page.goto("/cheer-songs/2026");

    // 投手タブ（デフォルト: 共通+個別投手応援歌）
    await expect(page.getByText("右投手共通応援歌")).toBeVisible();
    await expect(page.getByText("上沢 直之")).toBeVisible();

    // 野手個人タブ
    await page.getByRole("tab", { name: "野手個人" }).click();
    await expect(page.getByText("近藤 健介")).toBeVisible();
    await expect(page.getByText("柳田 悠岐")).toBeVisible();

    // その他共通タブ
    await page.getByRole("tab", { name: "その他共通" }).click();
    await expect(page.getByText("右打席野手共通応援歌")).toBeVisible();

    // チャンステーマタブ
    await page.getByRole("tab", { name: "チャンステーマ" }).click();
    await expect(page.getByText("わっしょい")).toBeVisible();

    // 球団歌タブ
    await page.getByRole("tab", { name: "球団歌" }).click();
    await expect(page.getByText("いざゆけ若鷹軍団")).toBeVisible();
  });

  test("応援歌カードが選手情報を表示する", async ({ page }) => {
    await page.goto("/cheer-songs/2026");

    // 野手個人タブへ
    await page.getByRole("tab", { name: "野手個人" }).click();

    // 近藤 健介(背番号3) が表示される
    await expect(page.getByText("近藤 健介")).toBeVisible();
  });

  test("リダイレクトページが最新年に遷移する", async ({ page }) => {
    await page.goto("/cheer-songs");

    await page.waitForURL("**/cheer-songs/2026");
    await expect(
      page.getByRole("heading", { name: "応援歌", exact: true }),
    ).toBeVisible();
  });
});
