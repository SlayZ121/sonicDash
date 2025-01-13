import k from "../kaplayCtx";

export default function gameOver(citySfx) {
  citySfx.paused = true;
  let bestscore = k.getData("best-score");
  const currentScore = k.getData("current-score");

  const ranks = ["F", "E", "D", "C", "B", "A", "A+"];
  const rankvalues = [50, 80, 100, 150, 250, 400, 450];

  let currrank = "F";
  let bestrank = "F";

  for (let i = 0; i < rankvalues.length; i++) {
    if (rankvalues[i] < currentScore) {
      currrank = ranks[i];
    }

    if (rankvalues[i] < bestscore) {
      bestrank = ranks[i];
    }
  }

  if (bestscore < currentScore) {
    k.setData("best-score", currentScore);
    bestscore = currentScore;
    bestrank = currrank;
  }

  k.add([
    k.text("GAME OVER", { font: "mania", size: 96 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 300),
  ]);
  k.add([
    k.text(`BEST SCORE : ${bestscore}`, {
      font: "mania",
      size: 64,
    }),
    k.anchor("center"),
    k.pos(k.center().x - 400, k.center().y - 200),
  ]);

  k.add([
    k.text(`CURRENT SCORE : ${currentScore}`, {
      font: "mania",
      size: 64,
    }),
    k.anchor("center"),
    k.pos(k.center().x + 400, k.center().y - 200),
  ]);

  const bestrankbox = k.add([
    k.rect(400, 400, { radius: 4 }),
    k.color(0, 0, 0),
    k.area(),
    k.anchor("center"),
    k.outline(6, k.Color.fromArray([255, 255, 255])), //thic n color
    k.pos(k.center().x - 400, k.center().y + 50),
  ]);

  bestrankbox.add([
    //child of rankbox
    k.text(bestrank, { font: "mania", size: 100 }),
    k.anchor("center"),
  ]);

  const currrankbox = k.add([
    k.rect(400, 400, { radius: 4 }),
    k.color(0, 0, 0),
    k.area(),
    k.anchor("center"),
    k.outline(6, k.Color.fromArray([255, 255, 255])), //thic n color
    k.pos(k.center().x + 400, k.center().y + 50),
  ]);

  currrankbox.add([
    //child of rankbox
    k.text(currrank, { font: "mania", size: 100 }),
    k.anchor("center"),
  ]);

  k.wait(1, () => {
    k.add([
      k.text("Press Space/Click/Touch to play again", {
        font: "mania",
        size: 64,
      }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y + 350),
    ]);
    k.onButtonPress("jump", () => {
      k.go("game");
    });
  });
}
