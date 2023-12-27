// global variables
let nitems: number = 0;
let positions: number[][];
let t: number = 0.;
let dt: number = 0.25;

// parameter of the Lissajous curve
let lis: {[key: string]: number} = {a: 0., b: 0., d: 0.};

function is_extreme(a: number, b: number): boolean {
  // avoid too distorted shape
  const thres: number = 1e-1;
  const small: number = 1e-8;
  const abs_a: number = 0. < a ? a : -1. * a;
  const abs_b: number = 0. < b ? b : -1. * b;
  if ((abs_a + small) / (abs_b + small) < thres) {
    return true;
  }
  if ((abs_b + small) / (abs_a + small) < thres) {
    return true;
  }
  return false;
}

function get_position(t: number): [number, number] {
  const x: number = Math.sin(lis.a * t + lis.d);
  const y: number = Math.sin(lis.b * t        );
  return [x, y];
}

export class Simulator {

  static init(): void {
    // initialise parameters of the Lissajous curve
    do {
      lis.a = Math.sin(2. * Math.PI * Math.random());
      lis.b = Math.sin(2. * Math.PI * Math.random());
      lis.d = Math.sin(2. * Math.PI * Math.random());
    } while(is_extreme(lis.a, lis.b));
    // normalise time step size nicely
    dt /= Math.sqrt(
      + Math.pow(lis.a, 2.)
      + Math.pow(lis.b, 2.)
    );
    //
    nitems = 1024;
    positions = new Array();
    for (let n = 0; n < nitems; n++) {
      positions.push(get_position(0.));
    }
  }

  static integrate(): number[][] {
    positions.shift();
    positions.push(get_position(t));
    t += dt;
    return positions;
  }

}

