mod constants;
mod store;

mod models {
    mod slayer;
    mod duel;
    mod score;
}

mod actions {
    mod play;
}

#[cfg(test)]
mod tests {
    mod setup;
    mod create;
    mod seek;
    mod play;
    mod buy;
    mod consume;
}
