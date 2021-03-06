import { stickGame } from "./stick-game";

const canvas: HTMLCanvasElement =
  document.querySelector("canvas") || document.createElement("canvas");

const context: CanvasRenderingContext2D = canvas.getContext("2d")!;

context.canvas.width = 800;
context.canvas.height = 600;

context.fillStyle = "rgba(0, 0, 0, 0.5)";
context.fillRect(0, 0, canvas.width, canvas.height);

if (!context.canvas.parentElement) {
  document.body.appendChild(context.canvas);
}

const game = stickGame({
  canvas,
  context,
});

game.start();
