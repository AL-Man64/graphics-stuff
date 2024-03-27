use std::{cell::RefCell, rc::Rc};

use app::Application;
use wasm_bindgen::prelude::*;

pub(crate) mod app;
pub(crate) mod star;
pub(crate) mod utils;

fn main() -> Result<(), JsValue> {
    let app_refcell = Rc::new(RefCell::new(Application::new()?));
    let app = app_refcell.borrow_mut();

    let f = Rc::new(RefCell::new(None));
    let g = Rc::clone(&f);

    let app_clone = Rc::clone(&app_refcell);

    *g.borrow_mut() = Some(Closure::new(move || {
        let mut app = app_clone.borrow_mut();

        app.request_animation_frame(f.borrow().as_ref().unwrap());

        app.update();
        app.draw();
    }));
    app.request_animation_frame(g.borrow().as_ref().unwrap());

    let app_clone = Rc::clone(&app_refcell);
    let callback = Closure::<dyn FnMut(web_sys::Event)>::new(move |_: web_sys::Event| {
        let mut app = app_clone.borrow_mut();

        app.width = app.window.inner_width().unwrap().as_f64().unwrap();
        app.height = app.window.inner_height().unwrap().as_f64().unwrap();

        app.canvas.set_width(app.width as u32);
        app.canvas.set_height(app.height as u32);
    });
    app.window
        .add_event_listener_with_callback("resize", callback.as_ref().unchecked_ref())?;
    callback.forget();

    let app_clone = Rc::clone(&app_refcell);
    let callback = Closure::<dyn FnMut()>::new(move || {
        let mut app = app_clone.borrow_mut();
        app.mouse_held = true;
    });
    app.window
        .add_event_listener_with_callback("mousedown", callback.as_ref().unchecked_ref())?;
    callback.forget();

    let app_clone = Rc::clone(&app_refcell);
    let callback = Closure::<dyn FnMut()>::new(move || {
        let mut app = app_clone.borrow_mut();
        app.mouse_held = false;
    });
    app.window
        .add_event_listener_with_callback("mouseup", callback.as_ref().unchecked_ref())?;
    callback.forget();

    Ok(())
}
