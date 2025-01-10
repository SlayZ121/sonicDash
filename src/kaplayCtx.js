import kaplay from "kaplay";

const k = kaplay({
  width: 1920,
  height: 1080,
  letterbox: true, //scale canvas to keep aspect ratio;
  background: [0, 0, 0],
  global: false,
  touchToMouse: true, // translate any touch input as clicks
  buttons: {
    jump: {
      keyboard: ["space"],
      mouse: "left",
    },
  },
  debugKey: "d",
  debug: true,
});

export default k;
