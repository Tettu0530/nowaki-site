import BenchmarksPage from "../../components/BenchmarksPage.tsx";
import { STRINGS, explainerHead } from "../../lib/i18n.ts";

const s = STRINGS.ja.benchPage;
export const lang = "ja";
export const title = s.title;
export const head = explainerHead("ja", "benchmarks", s.title, s.desc);

export default function Route() {
  return <BenchmarksPage locale="ja" />;
}
