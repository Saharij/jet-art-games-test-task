import { Application } from "pixi.js";
import { List } from "./List";

export class App {
  private app!: Application;
  private list!: List;

  async init() {
    this.app = new Application();

    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      background: 0x999da0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio, 2),
      autoDensity: true,
    });

    const canvas = this.app.canvas;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";

    document.body.appendChild(this.app.canvas);

    this.list = new List(this.app);

    window.addEventListener("resize", this.onResize);
    window.screen.orientation?.addEventListener(
      "change",
      this.onOrientationChange,
    );

    this.tryFullScreen();
  }

  private onResize = () => {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.list.resize();
  };

  private onOrientationChange = () => {
    setTimeout(() => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.list.resize();
    }, 100);
  };

  private tryFullScreen() {
    const isMobile = /Mobi|Addinor|iPhone|iPad/i.test(navigator.userAgent);
    const el = document.documentElement as any;

    const requestFS =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    alert("try out " + isMobile + requestFS);
    if (isMobile && document.documentElement.requestFullscreen) {
      alert("try in");
      document.addEventListener(
        "touchstart",
        () => {
          document.documentElement
            .requestFullscreen()
            .then(() => alert("try succeed"))
            .catch(() => {});
        },
        { once: true },
      );
    }
  }
}
