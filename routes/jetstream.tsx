import JetstreamPage from "../components/JetstreamPage.tsx";
import { explainerHead } from "../lib/i18n.ts";
import { JETSTREAM } from "../lib/explainers.ts";

const s = JETSTREAM.en;
export const lang = "en";
export const title = s.title;
export const head = explainerHead("en", "jetstream", s.title, s.desc);

export default function Route() {
  return <JetstreamPage locale="en" />;
}
