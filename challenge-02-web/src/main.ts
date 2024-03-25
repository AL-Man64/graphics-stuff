/* PARAMETERS - DEFAULT VALUES */

// Smoother animation 😍 (fractional and negative amounts may lead to weird
// results, large values may mess with opacity)
const UPDATES_PER_FRAME: number = 1;
const CLEAR_OPACITY: number = 0.1;
const CIRCLE_COUNT: number = 64;
const MIN_CIRCLE_RADIUS: number = 2;
const MAX_CIRCLE_RADIUS: number = 5;
const MIN_TRAJECTORY_RADIUS: number = 60;
const MAX_TRAJECTORY_RADIUS: number = 120;
const COLOR_VARIATION: number = 0.45;
const MIN_ANGULAR_VELOCITY: number = 0.8;
const MAX_ANGULAR_VELOCITY: number = 1.6;
// Dumb name, I love it
const SUCKINESS: number = 2.0;

/* PARAMETERS - TWEAKABLE */

let updates_per_frame: number = UPDATES_PER_FRAME;
let clear_opacity: number = CLEAR_OPACITY;
let circle_count: number = CIRCLE_COUNT;
let min_circle_radius: number = MIN_CIRCLE_RADIUS;
let max_circle_radius: number = MAX_CIRCLE_RADIUS;
let min_trajectory_radius: number = MIN_TRAJECTORY_RADIUS;
let max_trajectory_radius: number = MAX_TRAJECTORY_RADIUS;
let color_variation: number = COLOR_VARIATION;
let min_angular_velocity: number = MIN_ANGULAR_VELOCITY;
let max_angular_velocity: number = MAX_ANGULAR_VELOCITY;
let suckiness: number = SUCKINESS;

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
      Math.random() * (max_circle_radius - min_circle_radius) +
      min_circle_radius;
    this.trajectory_radius =
      Math.random() * (max_trajectory_radius - min_trajectory_radius) +
      min_trajectory_radius;
    this.angle = Math.random() * 2 * Math.PI;
    this.angular_velocity =
      Math.random() * (max_angular_velocity - min_angular_velocity) +
      min_angular_velocity;
    this.color = {
      r: color_variation * Math.random(),
      g: color_variation * Math.random(),
      b: color_variation * Math.random() + 1 - color_variation,
    };
  }
}

let circles: Array<Circle>;

function reset_circles() {
  circles = new Array();
  for (let i = 0; i < circle_count; i++) {
    circles.push(new Circle());
  }
}

/* PARAMETERS - HTML SLIDERS */

document
  .getElementById("updates-per-frame")
  ?.addEventListener("input", (event: any) => {
    updates_per_frame = event.target.value;
  });

document
  .getElementById("clear-opacity")
  ?.addEventListener("input", (event: any) => {
    clear_opacity =
      0.5 * CLEAR_OPACITY + (event.target.value / 100) * 1.5 * CLEAR_OPACITY;
  });

document
  .getElementById("circle-count")
  ?.addEventListener("input", (event: any) => {
    circle_count =
      0.5 * CIRCLE_COUNT + (event.target.value / 100) * 1.5 * CIRCLE_COUNT;
    reset_circles();
  });

document
  .getElementById("min-circle-radius")
  ?.addEventListener("input", (event: any) => {
    min_circle_radius =
      0.5 * MIN_CIRCLE_RADIUS +
      (event.target.value / 100) * 1.5 * MIN_CIRCLE_RADIUS;
    reset_circles();
  });

document
  .getElementById("max-circle-radius")
  ?.addEventListener("input", (event: any) => {
    max_circle_radius =
      0.5 * MAX_CIRCLE_RADIUS +
      (event.target.value / 100) * 1.5 * MAX_CIRCLE_RADIUS;
    reset_circles();
  });

document
  .getElementById("min-trajectory-radius")
  ?.addEventListener("input", (event: any) => {
    min_trajectory_radius =
      0.5 * MIN_TRAJECTORY_RADIUS +
      (event.target.value / 100) * 1.5 * MIN_TRAJECTORY_RADIUS;
    reset_circles();
  });

document
  .getElementById("max-trajectory-radius")
  ?.addEventListener("input", (event: any) => {
    max_trajectory_radius =
      0.5 * MAX_TRAJECTORY_RADIUS +
      (event.target.value / 100) * 1.5 * MAX_TRAJECTORY_RADIUS;
    reset_circles();
  });

document
  .getElementById("color-variation")
  ?.addEventListener("input", (event: any) => {
    color_variation =
      0.5 * COLOR_VARIATION +
      (event.target.value / 100) * 1.5 * COLOR_VARIATION;
    reset_circles();
  });

document
  .getElementById("min-angular-velocity")
  ?.addEventListener("input", (event: any) => {
    min_angular_velocity =
      0.5 * MIN_ANGULAR_VELOCITY +
      (event.target.value / 100) * 1.5 * MIN_ANGULAR_VELOCITY;
    reset_circles();
  });

document
  .getElementById("max-angular-velocity")
  ?.addEventListener("input", (event: any) => {
    max_angular_velocity =
      0.5 * MAX_ANGULAR_VELOCITY +
      (event.target.value / 100) * 1.5 * MAX_ANGULAR_VELOCITY;
    reset_circles();
  });

document
  .getElementById("suckiness")
  ?.addEventListener("input", (event: any) => {
    suckiness = 0.5 * SUCKINESS + (event.target.value / 100) * 1.5 * SUCKINESS;
  });

/* MAIN FUNCTION */

function main() {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
    document.getElementById("main-canvas")
  );
  canvas.width = window.innerWidth;
  canvas.height = (window.innerHeight * 80) / 100;
  const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>(
    canvas.getContext("2d")
  );

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "low";

  let running: boolean = true;
  let last_time: number = 0;
  let mouse = {
    x: 300,
    y: 300,
  };

  let origin_pos = {
    x: 300,
    y: 300,
  };

  reset_circles();

  const update_scene = (delta: number) => {
    if (running) {
      if (mouse.x !== origin_pos.x) {
        origin_pos.x +=
          (delta / updates_per_frame) * (mouse.x - origin_pos.x) * suckiness;
      }
      if (mouse.y !== origin_pos.y) {
        origin_pos.y +=
          (delta / updates_per_frame) * (mouse.y - origin_pos.y) * suckiness;
      }

      for (let circle of circles) {
        circle.angle += (delta / updates_per_frame) * circle.angular_velocity;
        if (circle.angle >= 2 * Math.PI) {
          circle.angle - 2 * Math.PI;
        }
      }
    }
  };

  const draw_scene = () => {
    ctx.globalAlpha = clear_opacity / updates_per_frame;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 1.0;
    for (const circle of circles) {
      const x: number =
        origin_pos.x + circle.trajectory_radius * Math.cos(circle.angle);
      const y: number =
        origin_pos.y + circle.trajectory_radius * -Math.sin(circle.angle);

      ctx.fillStyle = `rgb(${circle.color.r * 255}, ${circle.color.g * 255}, ${circle.color.b * 255})`;
      ctx.beginPath();
      ctx.arc(x, y, circle.radius, 0, 2 * Math.PI, true);
      ctx.fill();
    }
  };

  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key == " ") {
      running = false;
    }
  });

  window.addEventListener("keyup", (event: KeyboardEvent) => {
    if (event.key == " ") {
      running = true;
    }
  });

  window.addEventListener("resize", (_: UIEvent) => {
    canvas.width = window.innerWidth;
    canvas.height = (window.innerHeight * 80) / 100;
  });

  canvas.addEventListener("mousemove", (event: MouseEvent) => {
    mouse.x = event.x;
    mouse.y = event.y - (window.innerHeight * 20) / 100;
    draw_scene();
  });

  const animation_frame = (time: number) => {
    window.requestAnimationFrame(animation_frame);

    let delta = (time - last_time) / 1000;
    last_time = time;

    update_scene(delta);
    draw_scene();
    for (let i = 0; i < updates_per_frame - 1; i++) {
      update_scene(delta);
      draw_scene();
    }
  };

  window.requestAnimationFrame(animation_frame);
}

main();
