export type DragState = {
  active: boolean;
  startY: number;
  lastY: number;
  lastTime: number;
  velocity: number;
};

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private drag: DragState = {
    active: false,
    startY: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
  };

  onWheel?: (deltaY: number) => void;
  onDragStart?: (y: number) => void;
  onDragMove?: (deltaY: number) => void;
  onDragEnd?: (velocity: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.bind();
  }

  private bind() {
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("touchstart", this.onTouchStart, {
      passive: false,
    });
    this.canvas.addEventListener("touchmove", this.onTouchMove, {
      passive: false,
    });
    this.canvas.addEventListener("touchend", this.onTouchEnd);
    this.canvas.addEventListener("wheel", this.onWheelEvent, {
      passive: false,
    });
  }

  private beginDrag(y: number) {
    this.drag.active = true;
    this.drag.startY = y;
    this.drag.lastY = y;
    this.drag.velocity = 0;
    this.drag.lastTime = performance.now();
    this.onDragStart?.(y);
  }

  private moveDrag(y: number) {
    if (!this.drag.active) {
      return;
    }

    const now = performance.now();
    const deltaTime = now - this.drag.lastTime;
    const deltaY = y - this.drag.lastY;

    if (deltaTime > 0) {
      const instantVelocity = deltaY / deltaTime;
      this.drag.velocity = this.drag.velocity * 0.6 + instantVelocity * 0.4;
    }

    this.drag.lastY = y;
    this.drag.lastTime = now;
    this.onDragMove?.(deltaY);
  }

  private endDrag() {
    if (!this.drag.active) {
      return;
    }
    this.drag.active = false;
    this.onDragEnd?.(this.drag.velocity);
  }

  private onTouchStart = (e: TouchEvent) => {
    e.preventDefault();

    if (e.touches.length) {
      this.beginDrag(e.touches[0].clientY);
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    e.preventDefault();

    if (e.touches.length) {
      this.moveDrag(e.touches[0].clientY);
    }
  };

  private onTouchEnd = () => {
    this.endDrag();
  };

  private onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    this.beginDrag(e.clientY);
  };

  private onMouseMove = (e: MouseEvent) => {
    this.moveDrag(e.clientY);
  };

  private onMouseUp = () => {
    this.endDrag();
  };

  private onWheelEvent = (e: WheelEvent) => {
    e.preventDefault();
    this.onWheel?.(-e.deltaY);
  };

  destroy() {
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
    this.canvas.removeEventListener("touchstart", this.onTouchStart);
    this.canvas.removeEventListener("touchmove", this.onTouchMove);
    this.canvas.removeEventListener("touchend", this.onTouchEnd);
    this.canvas.removeEventListener("wheel", this.onWheelEvent);
  }
}
