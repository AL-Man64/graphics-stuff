use wasm_bindgen::prelude::*;

use crate::{
    star::{PolarCoord, Star, ANGULAR_VELOCITY, MAX_STAR_RADIUS, MIN_STAR_RADIUS, STAR_COLORS},
    utils::random_in_range,
};

pub(crate) const STAR_COUNT: usize = 256;
pub(crate) const MAX_EFFECT_STRENGTH: usize = 256;
pub(crate) const MIN_EFFECT_OPACITY: f64 = 0.05;

pub(crate) struct Application {
    pub(crate) window: web_sys::Window,
    pub(crate) mouse_held: bool,

    pub(crate) width: f64,
    pub(crate) height: f64,

    pub(crate) canvas: web_sys::HtmlCanvasElement,
    pub(crate) ctx: web_sys::CanvasRenderingContext2d,

    pub(crate) stars: Vec<Star>,
    pub(crate) effect_strength: usize,
}

/// # Application pub(crate)lic functions
impl Application {
    pub(crate) fn new() -> Result<Self, JsValue> {
        let window = web_sys::window().unwrap();

        let width = window.inner_width().unwrap().as_f64().unwrap();
        let height = window.inner_height().unwrap().as_f64().unwrap();

        let document = window.document().unwrap();
        let canvas = document
            .get_element_by_id("canvas")
            .unwrap()
            .dyn_into::<web_sys::HtmlCanvasElement>()?;

        canvas.set_width(width as u32);
        canvas.set_height(height as u32);

        let ctx = canvas
            .get_context("2d")?
            .unwrap()
            .dyn_into::<web_sys::CanvasRenderingContext2d>()?;

        let mut stars = Vec::with_capacity(STAR_COUNT);
        for i in 0..STAR_COUNT {
            let r = random_in_range(MIN_STAR_RADIUS, MAX_STAR_RADIUS);

            let x = random_in_range(0.0, width / 2.0);
            let y = random_in_range(0.0, height / 2.0);

            // There is no mathematical logic to these expressions but I found
            // myself being pretty happy with the results I have gotten
            let pos = PolarCoord {
                r: f64::sqrt(f64::powi(x, 2) + f64::powi(y, 2)),
                phi: i as f64 * std::f64::consts::TAU / STAR_COUNT as f64,
            };

            let mut i = random_in_range(0.0, 5.0) as usize;
            if i == 5 {
                i = 4;
            }
            let color = STAR_COLORS[i];

            stars.push(Star { r, pos, color });
        }

        let mouse_held = false;
        let effect_strength = 0;

        Ok(Self {
            window,
            mouse_held,

            width,
            height,

            canvas,
            ctx,

            stars,
            effect_strength,
        })
    }

    pub(crate) fn request_animation_frame(&self, f: &Closure<dyn FnMut()>) {
        self.window
            .request_animation_frame(f.as_ref().unchecked_ref())
            .expect("should register `requestAnimationFrame` OK");
    }
}

/// # Application animation logic
impl Application {
    pub(crate) fn update(&mut self) {
        if self.mouse_held && self.effect_strength <= MAX_EFFECT_STRENGTH {
            self.effect_strength += 1;
        } else if self.effect_strength > 0 {
            self.effect_strength -= 1;
        }

        for star in self.stars.iter_mut() {
            star.pos.phi += ANGULAR_VELOCITY
                * (64.0 * self.effect_strength as f64 / MAX_EFFECT_STRENGTH as f64 + 1.0);
        }
    }

    pub(crate) fn draw(&self) {
        self.ctx.set_global_alpha(
            1.0 - (self.effect_strength as f64 * (1.0 - MIN_EFFECT_OPACITY)
                / MAX_EFFECT_STRENGTH as f64),
        );
        self.ctx.set_shadow_blur(0.0);
        self.ctx.set_fill_style(&JsValue::from_str("black"));
        self.ctx.fill_rect(0.0, 0.0, self.width, self.height);

        self.ctx.set_global_alpha(1.0);
        for star in &self.stars {
            self.ctx.begin_path();

            let x = self.width / 2.0 + f64::cos(star.pos.phi) * star.pos.r;
            let y = self.height / 2.0 - f64::sin(star.pos.phi) * star.pos.r;

            self.ctx
                .arc(x, y, star.r, 0.0, std::f64::consts::TAU)
                .unwrap();
            self.ctx.set_shadow_color(star.color);
            self.ctx
                .set_shadow_blur(16.0 * star.r * self.effect_strength as f64 / star.pos.r);
            self.ctx.set_fill_style(&star.color.into());
            self.ctx.fill();
        }
    }
}
