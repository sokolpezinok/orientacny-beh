import LICENSE from "@/../LICENSE?raw";
import { Anchor } from "./Design";

export default () => {
  return (
    <>
      <Anchor href="https://prihlasky.sokolpezinok.sk/legal/gdpr.html">Oznámenie o spracovaní osobných údajov</Anchor>
      <br />
      <pre className="overflow-auto">{`Copyright ${new Date().getFullYear()} KOB Sokol Pezinok\n${LICENSE}`}</pre>
    </>
  );
};
