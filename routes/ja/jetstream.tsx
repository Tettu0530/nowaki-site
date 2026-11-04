import JetstreamPage from "../../components/JetstreamPage.tsx";
import { explainerHead } from "../../lib/i18n.ts";
import { JETSTREAM } from "../../lib/explainers.ts";

const s = JETSTREAM.ja;
export const lang = "ja";
export const title = s.title;
export const head = explainerHead("ja", "jetstream", s.title, s.desc);

export default function Route() {
  return <JetstreamPage locale="ja" />;
}
