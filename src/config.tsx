
export let window_size = [0, 0];

export let separation_range: number = 20;
export let separation_range2: number = separation_range ** 2;
export let separation_strength: number = 0.003;
export let sight_range: number = 80;
export let sight_range2: number = sight_range ** 2;
export let alignment_strength: number = 0.005;
export let cohesion_strength: number = 0.0001;
export let max_speed: number = 0.4;

export let border_field_range = 100;
export let border_field_strength = 0.02;

export let show_sight_range = false;
export let show_border_field = false;

export const set_sight_range = (value: number) => {
    sight_range = value;
    sight_range2 = value ** 2;
}

export const set_separation_range = (value: number) => {
    separation_range = value;
    separation_range2 = value ** 2;
}

export const set_separation_strength = (value: number) => {
    separation_strength = value;
}

export const set_alignment_strength = (value: number) => {
    alignment_strength = value;
}

export const set_cohesion_strength = (value: number) => {
    cohesion_strength = value;
}

export const set_max_speed = (value: number) => {
    max_speed = value;
}

export const set_border_field_range = (value: number) => {
    border_field_range = value;
}

export const set_border_field_strength = (value: number) => {
    border_field_strength = value;
}

export const set_show_sight_range = (value: boolean) => {
    show_sight_range = value;
}

export const set_show_border_field = (value: boolean) => {
    show_border_field = value;
}
