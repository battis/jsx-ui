import { Component } from '@battis/jsx-components';
import { Nullable } from '@battis/typescript-tricks';
import './Flyout.scss';
declare type FlyoutItemHandler = (event: Event) => any;
declare type FlyoutItemConfig = {
    handler?: FlyoutItemHandler;
    href?: string;
    disabled?: boolean;
};
declare class FlyoutComponent extends Component {
    private _flyout;
    constructor(...args: any[]);
    get flyout(): Nullable<Flyout>;
}
declare class Anchor extends FlyoutComponent {
    render(children?: any): import("@battis/jsx-components/dist/src/Component").ComponentizedElement;
}
declare class Menu extends FlyoutComponent {
    render(children?: any): import("@battis/jsx-components/dist/src/Component").ComponentizedElement;
}
declare class Item extends FlyoutComponent {
    private handler;
    private href;
    private disabled;
    constructor({ handler, href, disabled }: FlyoutItemConfig);
    render(children?: any): Element;
}
/**
 * Flyout menu
 *
 * Can be styled with desired direction (`top`|`right`|`bottom`|`left`) for flyout menu:
 *
 * ```JSX
 * <Flyout class="top left">...</Flyout>
 * ```
 *
 * ...will send the flyout menu out to the top-left of the anchor.
 *
 * Can also be styled flush with an edge of the anchor:
 *
 * ```JSX
 * <Flyout class="flush-right">...</Flyout>
 * ```
 *
 * Or with a specific offset:
 *
 * ```JSX
 * <Flyout class="bottom right offset-right" style="--flyout-offset-right: 123px">...</Flyout>
 * ```
 */
export default class Flyout extends Component {
    private _anchor;
    private _menu;
    private get anchor();
    private get menu();
    static Anchor: typeof Anchor;
    static Menu: typeof Menu;
    static Item: typeof Item;
    constructor(...args: any[]);
    render(children?: Element[]): import("@battis/jsx-components/dist/src/Component").ComponentizedElement;
    open(): Promise<void>;
    close(): void;
}
export {};
