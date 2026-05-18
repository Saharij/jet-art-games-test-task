import { Container, Graphics } from "pixi.js";

const COLOR = "#48494b";

export class ListItem extends Container {
  private item!: Graphics;

  constructor(width: number, height: number) {
    super();
    this.item = new Graphics();

    const rect = this.item.roundRect(0, 0, width, height - 16, 16);
    rect.fill({ color: COLOR });

    this.addChild(rect);
  }

  resize(width: number, height: number) {
    this.item.clear();
    this.item.roundRect(0, 0, width, height - 16, 16).fill({ color: COLOR });
  }
}
