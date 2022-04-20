import { JSXComponent } from "@battis/jsx-factory";
import { AsynchronousFunction } from "@battis/typescript-tricks";
import "./PullToRefresh.scss";
export declare type PullToRefreshConfig = {
    refresh: AsynchronousFunction;
    status?: HTMLElement;
    loading?: Element;
    loadingMessage?: Element;
    stretcher?: Element;
    startDistance?: number;
    endDistance?: number;
    delay?: number;
};
export default class PullToRefresh implements JSXComponent {
    private readonly refresh;
    private readonly status;
    private readonly loadingMessage;
    private readonly stretcher;
    private readonly stretchable;
    private refreshable?;
    private start?;
    private readonly startDistance;
    private readonly endDistance;
    private readonly delay;
    private isLoading;
    constructor({ refresh, loadingMessage, stretcher, startDistance, // pixels
    endDistance, // pixels
    delay, }: PullToRefreshConfig);
    render(children?: any): any;
    private swipeStart;
    private swipeMove;
    private collapseStatus;
    private swipeEnd;
}
