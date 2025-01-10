import { makeSonic } from "../entities/sonic";
import k from "../kaplayCtx";

export default function mainMenu() {
  if (!k.getData("best-score")) k.setData("best-score", 0);
  k.onButtonPress("jump", () => k.go("game"));

  const bgPieceWidth = 1920;
  const bgPieces = [
    k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8)]),
    k.add([
      k.sprite("chemical-bg"),
      k.pos(bgPieceWidth * 2, 0),
      k.scale(2),
      k.opacity(0.8),
    ]),
  ];

  const platformWidth = 1280; //platform image width
  const platforms = [
    k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
    k.add([k.sprite("platforms"), k.pos(platformWidth * 4, 450), k.scale(4)]),
  ];

  k.add([
    k.text("Sonic Dash", { font: "mania", size: "110" }),
    k.pos(k.center().x, 400),
    k.anchor("center")
  ]);
  k.add([
    k.text("Press Space/click/Touch to Play", { font: "mania", size: "38" }),
    k.pos(k.center().x, k.center().y),
    k.anchor("center")
  ]);

  makeSonic(k.vec2(200, 745));

  k.onUpdate(() => {
    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2); //creating moving effect by alternatively placing the background image one after another
      bgPieces.push(bgPieces.shift()); //puahes first element to last
    }

    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platforms[1].width * 4, 450);
      platforms.push(platforms.shift());
    }

    platforms[0].move(-4000, 0);
    platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
  });
}
