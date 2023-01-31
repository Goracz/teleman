pub fn init() {
    log4rs::init_file("./utility/config/console.yaml", Default::default()).unwrap();
}
