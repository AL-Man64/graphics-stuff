/* PARAMETERS */

const CLEAR_OPACITY: number = 0.1;
const CIRCLE_COUNT: number = 32;
const MIN_CIRCLE_RADIUS: number = 2;
const MAX_CIRCLE_RADIUS: number = 5;
const MIN_TRAJECTORY_RADIUS: number = 60;
const MAX_TRAJECTORY_RADIUS: number = 120;
const COLOR_VARIATION: number = 0.45;
const MIN_ANGULAR_VELOCITY: number = 0.8;
const MAX_ANGULAR_VELOCITY: number = 1.6;
const MOUSE_DELTA: number = -0.01;

/* TYPES */

class Circle {
  radius: number;
  trajectory_radius: number;
  angle: number;
  angular_velocity: number;
  color: {
    r: number;
    g: number;
    b: number;
  };

  constructor() {
    this.radius =
      Math.random() * (MAX_CIRCLE_RADIUS - MIN_CIRCLE_RADIUS) +
      MIN_CIRCLE_RADIUS;
    this.trajectory_radius =
      Math.random() * (MAX_TRAJECTORY_RADIUS - MIN_TRAJECTORY_RADIUS) +
      MIN_TRAJECTORY_RADIUS;
    this.angle = Math.random() * 2 * Math.PI;
    this.angular_velocity =
      Math.random() * (MAX_ANGULAR_VELOCITY - MIN_ANGULAR_VELOCITY) +
      MIN_ANGULAR_VELOCITY;
    this.color = {
      r: COLOR_VARIATION * Math.random(),
      g: COLOR_VARIATION * Math.random(),
      b: COLOR_VARIATION * Math.random() + 1 - COLOR_VARIATION,
    };
  }
}

/* MAIN FUNCTION */

function main() {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
    document.getElementById("main-canvas")
  );
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>(
    canvas.getContext("2d")
  );

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "low";

  let circles: Array<Circle> = new Array();
  for (let i = 0; i < CIRCLE_COUNT; i++) {
    circles.push(new Circle());
  }

  let running: boolean = true;
  let last_time: number = 0;
  let mouse = {
    x: 300,
    y: 300,
  };

  const update_scene = (delta: number) => {
    // TODO: scene follows the mouse more slowly, kind of like a gravity effect

    if (running) {
      for (let circle of circles) {
        circle.angle += delta * circle.angular_velocity;
        if (circle.angle >= 2 * Math.PI) {
          circle.angle - 2 * Math.PI;
        }
      }
    }
  };

  const draw_scene = () => {
    ctx.globalAlpha = CLEAR_OPACITY;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 1.0;
    for (const circle of circles) {
      const x: number =
        mouse.x + circle.trajectory_radius * Math.cos(circle.angle);
      const y: number =
        mouse.y + circle.trajectory_radius * -Math.sin(circle.angle);

      ctx.fillStyle = `rgb(${circle.color.r * 255}, ${circle.color.g * 255}, ${circle.color.b * 255})`;
      ctx.beginPath();
      ctx.arc(x, y, circle.radius, 0, 2 * Math.PI, true);
      ctx.fill();
    }
  };

  window.addEventListener("resize", (_: UIEvent) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  window.addEventListener("mousemove", (event: MouseEvent) => {
    mouse.x = event.x;
    mouse.y = event.y;
    update_scene(MOUSE_DELTA);
    draw_scene();
  });

  const animation_frame = (time: number) => {
    window.requestAnimationFrame(animation_frame);

    let delta = (time - last_time) / 1000;
    last_time = time;

    update_scene(delta);
    draw_scene();
  };

  window.requestAnimationFrame(animation_frame);
}

main();
