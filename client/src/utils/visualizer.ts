class Visualizer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  height: number;
  width: number;

  constructor(canvas: HTMLCanvasElement) {
    this.height = 0;
    this.width = 0;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
  }

  updateCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    this.height = Math.floor(window.innerHeight / 2.2);
    if (window.innerWidth <= 800) {
      this.width = window.innerWidth - 32;
    } else {
      this.width = Math.floor(window.innerWidth / 2);
    }
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx?.scale(dpr, dpr);
    this.ctx?.translate(this.width * 0.5, this.height * 0.5);
  }
}

export default Visualizer;
