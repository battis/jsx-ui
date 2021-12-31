import JSXFactory, { JSXComponent, render } from "@battis/jsx-factory";
import { AsynchronousFunction } from "@battis/typescript-tricks";
import Visual from "../stylesheets/Visual";
import Icon from "./Icon";
import Loading from "./Loading";
import "./PullToRefresh.scss";

export type PullToRefreshConfig = {
  refresh: AsynchronousFunction;
  status?: HTMLElement;
  loading?: Element;
  loadingMessage?: Element;
  stretcher?: Element;
  startDistance?: number;
  endDistance?: number;
  delay?: number;
};

const Top = JSXFactory.elementFromSource(require("../icons/stretcher/top.svg"));
const MiddleStretching = JSXFactory.elementFromSource(
  require("../icons/stretcher/middle-stretching.svg")
);
const BottomStretching = JSXFactory.elementFromSource(
  require("../icons/stretcher/bottom-stretching.svg")
);
const Bottom = JSXFactory.elementFromSource(
  require("../icons/stretcher/bottom.svg")
);

export default class PullToRefresh implements JSXComponent {
  private readonly refresh: AsynchronousFunction;

  private readonly status = Visual.hide(<div class="pull-to-refresh status" />);

  private readonly loadingMessage: Element;
  private readonly stretcher: Element;
  private readonly stretchable: HTMLElement;
  private refreshable?: HTMLElement;

  private start?: Touch;

  private readonly startDistance: number;
  private readonly endDistance: number;
  private readonly delay: number;
  private isLoading = false;

  constructor({
    refresh,
    loadingMessage = (
      <div class="stretcher-wrapper">
        <Top />
        <Bottom />
        <Loading />
      </div>
    ),
    stretcher = (
      <div class="stretcher-wrapper">
        <Top />
        <MiddleStretching />
        <BottomStretching />
        <Icon.Loading />
      </div>
    ),
    startDistance = 50, // pixels
    endDistance = 200, // pixels
    delay = 500, // milliseconds
  }: PullToRefreshConfig) {
    this.refresh = refresh;
    this.loadingMessage = loadingMessage;
    this.stretcher = stretcher;
    this.stretchable = this.stretcher.querySelector(
      ".stretcher"
    ) as HTMLElement;
    this.status = Visual.hide(
      <div class="pull-to-refresh status">{this.stretcher}</div>
    );
    this.startDistance = Math.max(0, startDistance);
    this.endDistance = Math.max(endDistance, 50);
    this.delay = delay;
  }

  render(children?) {
    this.refreshable = (
      <div class="pull-to-refresh refreshable">{children}</div>
    );
    const element = (
      <div class="pull-to-refresh">
        {this.status}
        {this.refreshable}
      </div>
    );

    document.addEventListener("touchstart", this.swipeStart.bind(this), {
      passive: true,
    });
    document.addEventListener("touchmove", this.swipeMove.bind(this), {
      passive: true,
    });
    document.addEventListener("touchend", this.swipeEnd.bind(this), {
      passive: true,
    });

    return element;
  }

  private swipeStart(event) {
    if (!this.isLoading) {
      this.start = event.touches[0];
    }
  }

  private swipeMove(event) {
    if (this.start && !this.isLoading) {
      // mobile safari has no overscroll configuration, so will scroll negative
      if (window.scrollY <= 0) {
        const current = event.touches[0];
        const dy = current.clientY - this.start.clientY - window.scrollY;
        if (dy > this.startDistance && dy < this.endDistance) {
          Visual.unhide(this.status);
          this.status.style.transitionDuration = `${this.delay}ms`;
          this.stretchable.style.height = `${dy}px`;
          this.status.style.top = `${window.scrollY}px`;
          if (this.refreshable) {
            this.refreshable.style.top = `${dy}px`;
          }
        }
        if (
          dy >= this.endDistance &&
          this.status.firstElementChild !== this.loadingMessage
        ) {
          this.isLoading = true;
          render(this.status, this.loadingMessage);
          this.refresh().then(() => {
            this.collapseStatus();
            this.isLoading = false;
          });
        }
      }
    }
  }

  private collapseStatus() {
    render(this.status, this.stretcher);
    Visual.hide(this.status);
    this.stretchable.style.height = "auto";
    this.status.appendChild(this.stretcher);
    this.start = undefined;
    this.status.style.top = "0";
    if (this.refreshable) {
      this.refreshable.style.top = "0";
    }
  }

  private swipeEnd() {
    if (!this.isLoading) {
      this.collapseStatus();
    }
  }
}
