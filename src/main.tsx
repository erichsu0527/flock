
import { Bird } from "./bird";
import { BirdManager } from "./bird_manager";
import { window_size } from "./config";
import * as config from "./config";

let ca1 = document.getElementById("canvas1");
if (!(ca1 instanceof HTMLCanvasElement)) {
  throw new Error("Canvas 1 not found");
}
const canvas1 = ca1;

const c1 = canvas1.getContext("2d");
if (!c1) {
  throw new Error("Canvas 1 context not found");
}
const ctx1 = c1;

const control_panel = document.getElementById("control-panel");
if (!(control_panel instanceof HTMLDivElement)) {
  throw new Error("Control panel not found");
}

canvas1.width = window.innerWidth - 20;
canvas1.height = window.innerHeight - 20;
window_size[0] = canvas1.width;
window_size[1] = canvas1.height;

class Main {
  private frame_time: HTMLParagraphElement;
  public bird_count: number;
  public do_end: boolean = false;

  constructor(bird_count: number = 50) {
    // Frame time usage
    let frame_time = document.getElementById("frame_time_usage");
    if (!(frame_time instanceof HTMLParagraphElement)) {
      throw new Error("Frame time usage not found");
    }
    this.frame_time = frame_time;

    this.bird_count = bird_count;

    this.update_UI();
  }

  update_UI() {
    // Bird count
    let bird_count_input = document.getElementById("bird_count_slider");
    if (!(bird_count_input instanceof HTMLInputElement)) {
      throw new Error("Bird count input not found");
    }
    bird_count_input.value = this.bird_count.toString();
    bird_count_input.onchange = (e) => {
      if (!(e.target instanceof HTMLInputElement)) {
        throw new Error("Bird count input not found");
      }
      this.bird_count = parseInt(e.target.value);
      this.do_end = true;
    }

    let bird_count_text = document.getElementById("bird_count");
    if (!(bird_count_text instanceof HTMLParagraphElement)) {
      throw new Error("Bird count not found");
    }
    bird_count_text.innerHTML = this.bird_count.toString();
  }

  reset_canvas() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

    ctx1.strokeStyle = 'white';
    ctx1.lineWidth = 1;
    ctx1.beginPath();
    ctx1.rect(0, 0, canvas1.width, canvas1.height);
    ctx1.stroke();
  }

  async watch_dog() {
    while (true) {
      this.do_end = false;
      await this.run();
      this.update_UI();
    }
  }

  async run() {
    const birds = new BirdManager();

    let border = config.border_field_range;

    for (let i = 0; i < this.bird_count; i++) {
      let speed = 0.2;
      let angle = Math.random() * 2 * Math.PI;
      birds.add_bird(new Bird(
        Math.random() * (window_size[0] - border * 2) + border,
        Math.random() * (window_size[1] - border * 2) + border,
        speed * Math.cos(angle),
        speed * Math.sin(angle),
      ));
    }

    const dt = 1000 / 60;

    let ts = [];
    let i = 0;
    let max_size = 100;

    while (!this.do_end) {
      let t = performance.now();

      this.reset_canvas();
      birds.update(dt);
      birds.render(ctx1);

      if (ts.length < max_size) {
        ts.push((performance.now() - t) / dt);
      } else {
        ts[i] = (performance.now() - t) / dt;
      }
      i = (i + 1) % max_size;

      if (i % 40 == 0) {
        let ft = ts.reduce((a, b) => a + b, 0) / ts.length * 100;
        ft = Math.round(ft * 100) / 100;
        this.frame_time.innerHTML = ft.toString() + "%";
      }
      await new Promise(r => setTimeout(r, dt));
    }
  }
}

const setup_control = () => {
  // Sight range
  let sight_range = document.getElementById("sight_range");
  if (!(sight_range instanceof HTMLInputElement)) {
    throw new Error("Sight range not found");
  }
  sight_range.value = config.sight_range.toString();
  sight_range.onchange = (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      throw new Error("Sight range not found");
    }
    config.set_sight_range(parseInt(e.target.value));
  }

  // Cohesion strength
  const coh_scale = 100000;
  let cohesion_strength = document.getElementById("cohesion_str");
  if (!(cohesion_strength instanceof HTMLInputElement)) {
    throw new Error("Cohesion strength not found");
  }
  cohesion_strength.value = (config.cohesion_strength * coh_scale).toString();
  cohesion_strength.onchange = (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      throw new Error("Cohesion strength not found");
    }
    config.set_cohesion_strength(parseFloat(e.target.value) / coh_scale);
  }

  // Alignment strength
  const align_scale = 10000;
  let alignment_strength = document.getElementById("align_str");
  if (!(alignment_strength instanceof HTMLInputElement)) {
    throw new Error("Alignment strength not found");
  }
  alignment_strength.value = (config.alignment_strength * align_scale).toString();
  alignment_strength.onchange = (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      throw new Error("Alignment strength not found");
    }
    config.set_alignment_strength(parseFloat(e.target.value) / align_scale);
  }

  // Separation range
  let separation_range = document.getElementById("sep_range");
  if (!(separation_range instanceof HTMLInputElement)) {
    throw new Error("Separation range not found");
  }
  separation_range.value = config.separation_range.toString();
  separation_range.onchange = (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      throw new Error("Separation range not found");
    }
    config.set_separation_range(parseInt(e.target.value));
  }

  // Separation strength
  const sep_str_scale = 10000;
  let separation_strength = document.getElementById("sep_str");
  if (!(separation_strength instanceof HTMLInputElement)) {
    throw new Error("Separation strength not found");
  }
  separation_strength.value = (config.separation_strength * sep_str_scale).toString();
  separation_strength.onchange = (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      throw new Error("Separation strength not found");
    }
    config.set_separation_strength(parseFloat(e.target.value) / sep_str_scale);
  }

  // Border field range
  let border_field_range = document.getElementById("border_range");
  if (!(border_field_range instanceof HTMLInputElement)) {
    throw new Error("Border field range not found");
  }
  border_field_range.value = config.border_field_range.toString();
  border_field_range.onchange = (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      throw new Error("Border field range not found");
    }
    config.set_border_field_range(parseInt(e.target.value));
  }

  // Border field strength
  const border_str_scale = 1000;
  let border_field_strength = document.getElementById("border_str");
  if (!(border_field_strength instanceof HTMLInputElement)) {
    throw new Error("Border field strength not found");
  }
  border_field_strength.value = (config.border_field_strength * border_str_scale).toString();
  border_field_strength.onchange = (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      throw new Error("Border field strength not found");
    }
    config.set_border_field_strength(parseFloat(e.target.value) / border_str_scale);
  }

  // Show sight range
  let show_sight_range = document.getElementById("show_sight_range");
  if (!(show_sight_range instanceof HTMLInputElement)) {
    throw new Error("Show sight range not found");
  }
  show_sight_range.checked = config.show_sight_range;
  show_sight_range.onchange = (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      throw new Error("Show sight range not found");
    }
    config.set_show_sight_range(e.target.checked);
  }

  // Show border field
  let show_border_field = document.getElementById("show_border_range");
  if (!(show_border_field instanceof HTMLInputElement)) {
    throw new Error("Show border field not found");
  }
  show_border_field.checked = config.show_border_field;
  show_border_field.onchange = (e) => {
    if (!(e.target instanceof HTMLInputElement)) {
      throw new Error("Show border field not found");
    }
    config.set_show_border_field(e.target.checked);
  }

  // Default setting
  let default_setting = document.getElementById("default_setting");
  if (!(default_setting instanceof HTMLButtonElement)) {
    throw new Error("Default setting not found");
  }
  default_setting.onclick = () => {
    config.set_sight_range(80);
    config.set_separation_range(20);
    config.set_separation_strength(0.003);
    config.set_alignment_strength(0.005);
    config.set_cohesion_strength(0.0001);
    config.set_max_speed(0.4);
    config.set_border_field_range(100);
    config.set_border_field_strength(0.02);
    config.set_show_sight_range(false);
    config.set_show_border_field(false);
    main.bird_count = 50;

    setup_control();
    main.update_UI();
    main.do_end = true;
  }

   // Stress test setting
   let stress_setting = document.getElementById("stress_setting");
   if (!(stress_setting instanceof HTMLButtonElement)) {
     throw new Error("Default setting not found");
   }
   stress_setting.onclick = () => {
     config.set_sight_range(80);
     config.set_separation_range(20);
     config.set_separation_strength(0.003);
     config.set_alignment_strength(0.005);
     config.set_cohesion_strength(0.0001);
     config.set_max_speed(0.4);
     config.set_border_field_range(100);
     config.set_border_field_strength(0.02);
     config.set_show_sight_range(false);
     config.set_show_border_field(false);
     main.bird_count = 1000;
 
     setup_control();
     main.update_UI();
     main.do_end = true;
   }
}

setup_control();
// new Main(400).run();
const main = new Main()
main.watch_dog();