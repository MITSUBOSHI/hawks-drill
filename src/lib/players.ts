import Players2026 from "@/data/2026-players.jsonl.json";
import { PlayerType, Year } from "@/types/Player";

const playersByYearMap: Record<Year, PlayerType[]> = {
  2026: Players2026 as PlayerType[],
};

export function playersByYear(year: Year): PlayerType[] {
  return playersByYearMap[year];
}
