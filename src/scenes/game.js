import { makebug } from "../entities/bug";
import { makeRing } from "../entities/ring";
import { makeSonic } from "../entities/sonic";
import k from "../kaplayCtx";

export default function game() {
  k.setGravity(3100); // only game objects with body will be affected
  const citySfx = k.play("city", { volume: 0, loop: true });

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

  let score = 0;
  let scoremultiplier = 0;

  const scoreText = k.add([
    k.text("SCORE:0", { font: "mania", size: 72 }),
    k.pos(20, 20),
  ]);

  const sonic = makeSonic(k.vec2(200, 747));
  sonic.setControls();
  sonic.setEvents();
  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded()) {
      k.play("destroy", { volume: 0.5 });
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(enemy);
      sonic.play("jump");
      sonic.jump();
      scoremultiplier += 1;
      score += 10 * scoremultiplier;
      scoreText.text = `SCORE: ${score}`;
      sonic.ringCollectUI.text = `+${10 * scoremultiplier}`;
      k.wait(1, () => {
        sonic.ringCollectUI.text = "";
      });

      return;
    }
    k.play("hurt", { volume: 0.5 });
    k.setData("current-score", score);
    k.go("gameover", { citySfx });
  });

  sonic.onCollide("ring", (ring) => {
    k.play("ring", { volume: 0.5 });
    k.destroy(ring);
    score++;
    scoreText.text = `SCORE: ${score}`;
    sonic.ringCollectUI.text = "+1";
    k.wait(1, () => (sonic.ringCollectUI.text = ""));
  });

  let gamespeed = 300;
  k.loop(1, () => {
    gamespeed += 30;
  });

  const createBug = () => {
    const motobug = makebug(k.vec2(1950, 773));
    motobug.onUpdate(() => {
      if (gamespeed < 3000) {
        motobug.move(-(gamespeed + 300), 0);
        return;
      }
      motobug.move(-gamespeed, 0); //same speed as platform at higher speeds to make it playable
    });

    motobug.onExitScreen(() => {
      if (motobug.pos.x < 0) k.destroy(motobug);
    });

    const waittime = k.rand(0.5, 2.5);
    k.wait(waittime, createBug);
  };

  createBug();

  const spawnRing = () => {
    const ring = makeRing(k.vec2(1950, 745));
    ring.onUpdate(() => {
      ring.move(-gamespeed, 0); //same speed as platform at higher speeds to make it playable
    });

    ring.onExitScreen(() => {
      if (ring.pos.x < 0) k.destroy(ring);
    });

    const waittime = k.rand(0.5, 3);
    k.wait(waittime, spawnRing);
  };

  spawnRing();

  k.add([
    k.rect(1920, 3000),
    k.opacity(0),
    k.area(),
    k.pos(0, 832),
    k.body({ isStatic: true }),
    "platform",
  ]);

  k.onUpdate(() => {
    if (sonic.isGrounded()) {
      scoremultiplier = 0;
    }
    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2); //creating moving effect by alternatively placing the background image one after another
      bgPieces.push(bgPieces.shift()); //puahes first element to last
    }

    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platformWidth * 4, 450);
      platforms.push(platforms.shift());
    }

    platforms[0].move(-gamespeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + platformWidth * 4, 450);
  });
}
