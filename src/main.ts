// main.ts
import "./style.css";
import { P2P } from "./Lib/P2P";

import { UI } from "@peasy-lib/peasy-ui";
import { Engine, DisplayMode } from "excalibur";
import { model, template } from "./UI/UI";
import { Intro } from "./Scenes/intro";
import { Main } from "./Scenes/main";
import { loader } from "./resources";
import { UUID } from "./Lib/UUID";

await UI.create(document.body, model, template).attached;

export let myP2P = new P2P(`ExSmash-${UUID.generateUUID()}`);

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

await game.start(loader);
game.goToScene("intro");
