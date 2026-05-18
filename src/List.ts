import { Application, Container } from "pixi.js";
import { ListItem } from "./ListItem";
import { InputHandler } from "./InputHandler";

const ITEMS_AMOUNT = 50;
const FRICTION = 0.94;
const MIN_VELOCITY = 0.01;

export class List {
  private app: Application;
  private container: Container;
  private input: InputHandler;

  private items: ListItem[] = [];
  private scrollY = 0;
  private velocity = 0;
  private isAnimating = false;

  private itemWidth = 0;
  private itemHeight = 0;
  private screenWidth = 0;
  private screenHeight = 0;
  private totalHeight = 0;

  constructor(app: Application) {
    this.app = app;
    this.container = new Container();

    app.stage.addChild(this.container);

    this.input = new InputHandler(this.app.canvas as HTMLCanvasElement);
    this.input.onWheel = (deltaY: number) => {
      this.velocity = 0;
      this.scroll(deltaY * 0.8);
    };
    this.input.onDragMove = (deltaY: number) => {
      this.velocity = 0;
      this.scroll(deltaY);
    };

    this.input.onDragEnd = (vel: number) => {
      this.velocity = vel * 16;
      this.startAnimation();
    };

    this.defineDimensions(app.screen.width, app.screen.height);
    this.build();

    app.ticker.add(this.onTick);
  }

  private build() {
    this.items = [];

    for (let i = 0; i < ITEMS_AMOUNT; i++) {
      const item = new ListItem(this.itemWidth, this.itemHeight);
      this.defineItemPosition(item, i);

      this.container.addChild(item);
      this.items.push(item);
    }

    this.clampScroll();
    this.applyScroll();
  }

  resize() {
    const newScreenWidth = this.app.screen.width;
    const newScreenHeight = this.app.screen.height;
    const ratio = this.totalHeight > 0 ? this.scrollY / this.totalHeight : 0;

    this.defineDimensions(newScreenWidth, newScreenHeight);

    this.scrollY = ratio * this.totalHeight;
    this.velocity = 0;

    this.items.forEach((item, i) => {
      item.resize(this.itemWidth, this.itemHeight);
      this.defineItemPosition(item, i);
    });

    this.clampScroll();
    this.applyScroll();
  }

  private defineDimensions(width: number, height: number) {
    this.screenWidth = width;
    this.screenHeight = height;
    this.itemHeight = Math.round(this.screenHeight * 0.25);
    this.itemWidth = Math.round(this.screenWidth * 0.65);
    this.totalHeight = this.itemHeight * ITEMS_AMOUNT;
  }

  private defineItemPosition(item: ListItem, i: number) {
    item.y = i * this.itemHeight;
    item.x = Math.round((this.screenWidth - this.itemWidth) / 2);
  }

  private scroll(deltaY: number) {
    this.scrollY += deltaY;

    this.clampScroll();
    this.applyScroll();
  }

  private applyScroll() {
    this.container.y = this.scrollY;
  }

  private clampScroll() {
    const maxScroll = -(this.totalHeight - this.screenHeight);

    if (this.scrollY > 0) {
      this.scrollY = 0;
    }

    if (this.scrollY < maxScroll) {
      this.scrollY = maxScroll;
    }
  }

  private startAnimation() {
    if (!this.isAnimating) {
      this.isAnimating = true;
    }
  }

  private onTick = () => {
    if (!this.isAnimating) {
      return;
    }

    if (Math.abs(this.velocity) < MIN_VELOCITY) {
      this.velocity = 0;
      this.isAnimating = false;
      return;
    }

    this.scrollY += this.velocity;
    const maxScroll = -(this.totalHeight - this.screenHeight);

    if (this.scrollY > 0) {
      this.scrollY = 0;
      this.velocity = 0;
      this.isAnimating = false;
    } else if (this.scrollY < maxScroll) {
      this.scrollY = maxScroll;
      this.velocity = 0;
      this.isAnimating = false;
    }

    this.velocity *= FRICTION;
    this.applyScroll();
  };

  destroy() {
    this.app.ticker.remove(this.onTick);
    this.input.destroy();
    this.container.destroy({ children: true });
  }
}
