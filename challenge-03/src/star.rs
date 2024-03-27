pub(crate) const MIN_STAR_RADIUS: f64 = 2.0;
pub(crate) const MAX_STAR_RADIUS: f64 = 4.0;

pub(crate) const ANGULAR_VELOCITY: f64 = 0.000_2;

pub(crate) const STAR_COLORS: [&str; 5] = ["#c4786e", "#453f60", "#6eaee9", "#17bd9c", "#959b86"];

pub(crate) struct PolarCoord {
    pub(crate) r: f64,
    pub(crate) phi: f64,
}

pub(crate) struct Star {
    pub(crate) r: f64,
    pub(crate) pos: PolarCoord,
    pub(crate) color: &'static str,
}
