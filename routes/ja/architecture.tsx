import ArchitecturePage from "../../components/ArchitecturePage.tsx";
import { explainerHead } from "../../lib/i18n.ts";
import { ARCHITECTURE } from "../../lib/explainers.ts";

const s = ARCHITECTURE.ja;
export const lang = "ja";
export const title = s.title;
export const head = explainerHead("ja", "architecture", s.title, s.desc);

export default function Route() {
  return <ArchitecturePage locale="ja" />;
}
