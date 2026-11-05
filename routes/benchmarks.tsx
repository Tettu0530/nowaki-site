import BenchmarksPage from "../components/BenchmarksPage.tsx";
import { STRINGS, explainerHead } from "../lib/i18n.ts";

const s = STRINGS.en.benchPage;
export const lang = "en";
export const title = s.title;
export const head = explainerHead("en", "benchmarks", s.title, s.desc);

export default function Route() {
  return <BenchmarksPage locale="en" />;
}
