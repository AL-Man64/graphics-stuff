use js_sys::Math::random;

pub fn random_in_range(min: f64, max: f64) -> f64 {
    (max - min) * random() + min
}
