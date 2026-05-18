import { Container, Graphics } from "pixi.js";

const COLOR = "#48494b";

export class ListItem extends Container {
  private item!: Graphics;

  constructor(width: number, height: number) {
    super();
    this.item = new Graphics();
    this.drawItem(width, height);
    this.addChild(this.item);
  }

  resize(width: number, height: number) {
    this.drawItem(width, height);
  }

  private drawItem(width: number, height: number) {
    this.item.clear();
    this.item.roundRect(0, 8, width, height - 16, 16).fill({ color: COLOR });
  }
}
