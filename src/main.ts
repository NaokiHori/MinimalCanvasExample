import { Getter } from "./getter.js";
import { Simulator } from "./simulator.js";
import { draw_lines, draw_circle } from "./drawer.js";

function get_container_size(): [number, number] {
  const container: HTMLElement = Getter.canvas_container();
  const w: number = container.clientWidth;
  const h: number = container.clientHeight;
  return [w, h]
}

function update_size(): void {
  // equalise the size of the containier and canvas
  const [w, h]: [number, number] = get_container_size();
  const canvas: HTMLCanvasElement = Getter.canvas();
  canvas.width  = w;
  canvas.height = h;
}

function convert_positions([w, h]: [number, number], sposs: number[][]): number[][] {
  // in general simulated and canvas coordinates are different,
  //   which are to be transformed
  function rescale(x: number, axs: [number, number], bxs: [number, number]): number {
    // fit x: [axs[0] : axs[1]] inside [bxs[0] : bxs[1]]
    return bxs[0] + (x - axs[0]) / (axs[1] - axs[0]) * (bxs[1] - bxs[0]);
  }
  // simulation domain size
  const domain_size: [number, number] = [-1.2, +1.2];
  let cposs: number[][] = new Array();
  for (const spos of sposs) {
    let cpos: [number, number] = [
      rescale(spos[0], domain_size, [0, w]),
      rescale(spos[1], domain_size, [0, h]),
    ];
    cposs.push(cpos);
  }
  return cposs;
}

function update_and_draw(): void {
  // specify FPS to trigger event in a fixed frequency
  const FPS: number = 30;
  setTimeout(function() {
    // update canvas
    const context: CanvasRenderingContext2D = Getter.context();
    const [w, h]: [number, number] = get_container_size();
    // clean-up all
    context.clearRect(0, 0, w, h);
    // integrate in time to get new information
    const positions: number[][] = convert_positions([w, h], Simulator.integrate());
    draw_lines(context, positions);
    draw_circle(context, positions[positions.length - 1]);
    // set myself as the callback
    requestAnimationFrame(update_and_draw);
  }, 1000. / FPS);
}

window.addEventListener(`load`, (_event: Event) => {
  // initialise canvas size
  update_size();
  // initialise simulator
  Simulator.init();
  // trigger first animation flow
  update_and_draw();
});

window.addEventListener(`resize`, (_event: Event) => {
  update_size();
});

