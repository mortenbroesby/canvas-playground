type GameMode = "pointerdown" | "stickFall" | "wait" | "run" | "gameOver";

interface StickGameOptions {
  start: () => void;
}

export function stickGame({
  canvas,
  context,
}: {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}): StickGameOptions {
  console.log("Stick game: ", { canvas, context });

  const maxStones = 6;
  const size = 40;

  let mode: GameMode;

  let angle = -Math.PI / 2;
  let x: any;
  let y: any;
  let frame: any;
  let currentStone: any;
  let run: any;
  let offset: any;
  let stickLength: any;
  let stones: any;

  function reset() {
    currentStone = 0;
    x = 100;
    y = 360;
    frame = 0;
    stones = [];
    stickLength = 0;
    offset = 0;
    run = 0;

    for (let index = 0; index < maxStones; index++) {
      stones[index] = {
        x: index * 300 + Math.floor(Math.random() * 80),
        width: 50 + Math.floor(Math.random() * 50),
      };
    }

    stones[0].x = 80;
    mode = "wait";
  }

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const distanceText =
      "Distance remaining: " + (maxStones - currentStone - 1);

    context.fillText(distanceText, 250, 100);

    stones.forEach((stone: any) => {
      context.fillRect(stone.x - offset, 398, stone.width, 600);
    });

    function onPointerDown() {
      stickLength++;
    }

    function onStickFall() {
      angle = angle + Math.PI / 64;

      if (angle >= 0) {
        mode = "run";
      }
    }

    function onRun() {
      offset++;
      run++;
      frame = frame + 0.5;

      if (frame === 20) {
        frame = 0;
      }

      if (stickLength === run) {
        mode = "wait";
        angle = -Math.PI / 2;
        stickLength = 0;
        run = 0;
        let gameOver = true;

        stones.forEach((stone: any, index: number) => {
          const isWithinLeftBound = offset + x + size > stone.x;
          const isWithinRightBounds = offset + x < stone.x + stone.width - size;

          const isWithinBounds = isWithinLeftBound && isWithinRightBounds;
          if (isWithinBounds) {
            gameOver = false;
            currentStone = Math.max(currentStone, index);

            if (currentStone == maxStones - 1) {
              mode = "gameOver";
              frame = 21;
            }
          }
        });

        if (gameOver) {
          mode = "gameOver";
          frame = 20;
        }
      }
    }

    function onGameOver() {
      if (currentStone < maxStones - 1) {
        y++;
        context.fillText("Game over. Click to restart", 20, 60);
      } else {
        context.fillText("You win! Click to restart", 20, 60);
      }
    }

    function iterate() {
      let x2 = x + (stickLength - run) * Math.cos(angle);
      let y2 = y + (stickLength - run) * Math.sin(angle);

      context.beginPath();
      context.moveTo(x + size - run, y + size);
      context.lineTo(x2 + size, y2 + size);
      context.stroke();

      window.requestAnimationFrame(animate);
    }

    type ModeMap = {
      [key in GameMode]: () => void;
    };

    const modeMap: ModeMap = {
      pointerdown: () => onPointerDown(),
      stickFall: () => onStickFall(),
      run: () => onRun(),
      gameOver: () => onGameOver(),
      wait: () => {},
    };

    const targetAction = modeMap[mode];
    if (targetAction) {
      targetAction();
    }

    iterate();
  }

  function start() {
    console.log("Game has been started.");

    window.onpointerdown = function () {
      if (mode === "wait") {
        mode = "pointerdown";
      } else if (mode === "gameOver") {
        mode = "wait";
        reset();
      }
    };

    window.onpointerup = function () {
      if (mode === "pointerdown") {
        mode = "stickFall";
      }
    };

    reset();
    animate();
  }

  return {
    start,
  };
}
