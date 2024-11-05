// main.ts
import "./style.css";
import { P2P } from "./Lib/P2P";

import { UI } from "@peasy-lib/peasy-ui";
import { Engine, DisplayMode, Vector } from "excalibur";
import { hideUI, model, template } from "./UI/UI";
import { Intro } from "./Scenes/intro";
import { Main } from "./Scenes/main";
import { loader } from "./resources";
import { UUID } from "./Lib/UUID";
import { Bug } from "./Actors/bug";

await UI.create(document.body, model, template).attached;

const game = new Engine({
  width: 800, // the width of the canvas
  height: 600, // the height of the canvas
  canvasElementId: "cnv", // the DOM canvas element ID, if you are providing your own
  displayMode: DisplayMode.Fixed, // the display mode
  pixelArt: true,
  scenes: {
    main: new Main(),
    intro: new Intro(),
  },
});
export let myP2P = new P2P(game, `ExSmash-${UUID.generateUUID()}`);
await game.start(loader);
game.goToScene("intro");

game.on("hostStatusChanged", data => {
  hideUI();
  game.goToScene("main", { sceneActivationData: [myP2P] });
});
