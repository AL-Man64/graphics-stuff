/*
 * -----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <ladananton450@gmail.com> wrote this file.  As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and you
 * think this stuff is worth it, you can buy me a beer in return.   Anton Ladan
 * -----------------------------------------------------------------------------
 */

const colors = ["blue", "yellow", "white"];

let canvas = <HTMLCanvasElement>document.getElementById("canvas");
let ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

canvas.width = 640;
canvas.height = 640;

class Particle {
  accX: number = 0;
  accY: number = 0;
  velX: number = 0;
  velY: number = 0;
  x: number = 0;
  y: number = 0;
  oldX: number = 0;
  oldY: number = 0;
  color: string = "";

  constructor() {
    // Bosnian Fog :)
    const colorChoice = Math.random();
    if (colorChoice <= 0.6) {
      this.color = "blue";
    } else if (colorChoice <= 0.9) {
      this.color = "yellow";
    } else {
      this.color = "white";
    }
  }
}

function main() {
  const particles = new Array<Particle>();
  for (let i = 0; i < 128; i++) {
    particles.push(new Particle());
  }

  const animationFrame = () => {
    requestAnimationFrame(animationFrame);

    ctx.fillStyle = "black";
    ctx.fillRect(0.0, 0.0, canvas.width, canvas.height);

    for (let particle of particles) {
      particle.accX += (Math.random() - 0.5) * 0.01;
      particle.accY += (Math.random() - 0.5) * 0.01;

      particle.accX -= (0.01 * particle.x) / (canvas.width / 2.0);
      particle.accY -= (0.01 * particle.y) / (canvas.height / 2.0);

      if (Math.abs(particle.accX) > 1.0) {
        particle.accX *= 1.0 / Math.abs(particle.accX);
      }
      if (Math.abs(particle.accY) > 1.0) {
        particle.accY *= 1.0 / Math.abs(particle.accY);
      }

      particle.velX += particle.accX;
      particle.velY += particle.accY;

      if (Math.abs(particle.velX) > 1.0) {
        particle.velX *= 1.0 / Math.abs(particle.velX);
      }
      if (Math.abs(particle.velY) > 1.0) {
        particle.velY *= 1.0 / Math.abs(particle.velY);
      }

      particle.oldX = particle.x;
      particle.oldY = particle.y;

      particle.x += particle.velX;
      particle.y += particle.velY;

      if (Math.abs(particle.x) > canvas.width / 2.0) {
        particle.x *= canvas.width / 2.0 / Math.abs(particle.x);
        particle.accX = 0.0;
        particle.accY = 0.0;
        particle.velX = 0.0;
        particle.velY = 0.0;
      }
      if (Math.abs(particle.y) > canvas.height / 2.0) {
        particle.y *= canvas.height / 2.0 / Math.abs(particle.y);
      }
    }

    let previousParticle = particles[0];
    for (const particle of particles) {
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = 5.0;
      ctx.beginPath();
      ctx.moveTo(
        previousParticle.x + canvas.width / 2.0,
        previousParticle.y + canvas.height / 2.0,
      );
      ctx.lineTo(
        particle.oldX + canvas.width / 2.0,
        particle.oldY + canvas.height / 2.0,
      );
      ctx.lineTo(
        particle.x + canvas.width / 2.0,
        particle.y + canvas.height / 2.0,
      );
      ctx.stroke();
      previousParticle = particle;
    }
  };

  ctx.filter = "blur(32px)";
  requestAnimationFrame(animationFrame);
}

main();
