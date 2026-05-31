import { cheerSongsByYear, cheerSongYears } from "./cheerSongs";

describe("cheerSongYears", () => {
  it("選手名簿と同じ年範囲を昇順で返す", () => {
    expect(cheerSongYears).toEqual([2020, 2021, 2022, 2023, 2024, 2025, 2026]);
  });
});

describe("cheerSongsByYear", () => {
  const titlesOf = (year: number) => cheerSongsByYear(year).map((s) => s.title);

  it("選手個人の応援歌はその選手が在籍する年にのみ表示される", () => {
    // 上沢 直之 は 2025・2026 のみ在籍
    expect(titlesOf(2026)).toContain("上沢 直之");
    expect(titlesOf(2025)).toContain("上沢 直之");
    expect(titlesOf(2024)).not.toContain("上沢 直之");
    expect(titlesOf(2020)).not.toContain("上沢 直之");
  });

  it("背番号はその年の名簿の値に揃う", () => {
    // 大津 亮介: 2024 は背番号 26、2026 は 19
    const otsu2024 = cheerSongsByYear(2024).find(
      (s) => s.title === "大津 亮介",
    );
    const otsu2026 = cheerSongsByYear(2026).find(
      (s) => s.title === "大津 亮介",
    );
    expect(otsu2024?.playerNumber).toBe("26");
    expect(otsu2026?.playerNumber).toBe("19");
  });

  it("表記揺れのある外国人選手もふりがなで照合される", () => {
    // 曲データは「ジーター・ダウンズ」、名簿は「ダウンズ」(ふりがな一致)
    expect(titlesOf(2026)).toContain("ジーター・ダウンズ");
  });

  it("共通応援歌・チャンステーマ・球団歌は全年で表示される", () => {
    for (const year of cheerSongYears) {
      const titles = titlesOf(year);
      expect(titles).toContain("右投手共通応援歌");
      expect(titles).toContain("いざゆけ若鷹軍団");
      expect(titles).toContain("わっしょい");
    }
  });
});
