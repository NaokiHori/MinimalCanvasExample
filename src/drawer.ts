function to_hex(x: number): string {
  return ((`00` + Math.floor(255. * x).toString(16)).substr(-2));
}

export function draw_lines(context: CanvasRenderingContext2D, positions: number[][]): void {
  // draw a line through all points
  const nitems: number = positions.length;
  context.lineWidth = 2.;
  for (let n: number = 0; n < nitems - 1; n++) {
    // map [0:1] to [00:ff]
    const scale: string = to_hex(1. * n / nitems);
    context.strokeStyle = `#${scale}${scale}${scale}`;
    context.beginPath();
    context.moveTo(
      positions[n][0],
      positions[n][1],
    );
    context.lineTo(
      positions[n + 1][0],
      positions[n + 1][1],
    );
    context.stroke();
  }
}

export function draw_circle(context: CanvasRenderingContext2D, position: number[]): void {
  // draw a circle at the specified position
  context.fillStyle = `#ffff88`
  context.beginPath();
  context.arc(
    position[0],
    position[1],
    context.lineWidth * 5,
    0.,
    2. * Math.PI,
  );
  context.fill();
}

