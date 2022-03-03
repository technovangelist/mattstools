// import * as cliffy from "https://deno.land/x/cliffy@v0.20.1/mod.ts";
import {
  keypress,
  KeyPressEvent,
} from "https://deno.land/x/cliffy@v0.20.1/keypress/mod.ts";
const readJson = async (filePath: string) => {
  const content = await Deno.readTextFile(filePath);
  return JSON.parse(content);
};
const config: { command: string; devcommand: string; prodcommand: string } =
  await readJson(`${Deno.env.get("HOME")}/.config/devswap.json`);

const fileInfo = await Deno.realPath(config.command);
if (fileInfo == config.prodcommand) {
  console.log("Running Production version. Press 'Y' to run dev version.");
} else if (fileInfo == config.devcommand) {
  console.log("Running Dev version. Press 'Y' to run production version.");
}
const event: KeyPressEvent = await keypress();
if (event.key == "y") {
  Deno.remove(config.command);
  if (fileInfo == config.prodcommand) {
    Deno.symlink(config.devcommand, config.command);
    console.log("replacing Prod with Dev");
  } else if (fileInfo == config.devcommand) {
    Deno.symlink(config.prodcommand, config.command);
    console.log("replacing dev with prod");
  }
} else {
  console.log("No changes");
}
