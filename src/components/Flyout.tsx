import { Component } from '@battis/jsx-components';
import JSXFactory from '@battis/jsx-factory';
import { _Object } from '@battis/monkey-patches';
import { Nullable, Optional } from '@battis/typescript-tricks';
import './Flyout.scss';
import Scrim from './Scrim';

type FlyoutPosition =
    | 'auto'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
type FlyoutConfig = { position?: FlyoutPosition };
type FlyoutItemHandler = (event: Event) => any;
type FlyoutItemConfig = {
    handler?: FlyoutItemHandler;
    href?: string;
    disabled?: boolean;
};

class FlyoutComponent extends Component {
    private _flyout: Nullable<Flyout> = null;

    public constructor(...args) {
        super(...args);
    }

    public get flyout() {
        if (!this._flyout) {
            this._flyout = Flyout.parent(this.element);
        }
        return this._flyout;
    }
}

class Anchor extends FlyoutComponent {
    render(children?) {
        this.element = <div class="anchor">{children}</div>;
        // https://stackoverflow.com/a/49987413/294171
        ['mouseenter', 'pointerover', 'touchstart', 'MSPointerOver'].forEach(
            event => {
                this.element.addEventListener(
                    event,
                    () => this.flyout?.open(),
                    { passive: true }
                );
            }
        );
        return this.element;
    }
}

class Menu extends FlyoutComponent {
    render(children?) {
        this.element = (
            <div class="menu" onmouseleave={() => this.flyout?.close()}>
                <div class="menu-items">{children}</div>
            </div>
        );
        return this.element;
    }
}

class Item extends FlyoutComponent {
    private handler: Optional<FlyoutItemHandler>;
    private href: Optional<string>;
    private disabled: boolean;

    constructor({ handler, href, disabled = false }: FlyoutItemConfig) {
        super();
        this.handler = handler;
        this.href = href;
        this.disabled = disabled;
        if (!this.handler && !this.href && !this.disabled) {
            throw new Error(
                'Flyout menu item must have a handler or HREf, or be disabled'
            );
        }
    }

    render(children?) {
        const Tag = (this.href && 'a') || 'div';

        const props = {};
        if (this.href) {
            props['href'] = this.href;
        }
        if (this.handler) {
            props['onclick'] = this.handler;
        }
        this.element = (
            <Tag class={`item ${this.disabled ? 'disabled' : ''}`} {...props} />
        );
        return super.render(children);
    }
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
    private _anchor: Nullable<Anchor>;
    private _menu: Nullable<Menu>;

    private get anchor() {
        if (!this._anchor) {
            const elt = this.element.querySelector('.anchor');
            this._anchor = (elt && Anchor.for(elt)) || null;
        }
        return this._anchor;
    }

    private get menu() {
        if (!this._menu) {
            const elt = this.element.querySelector('.menu');
            this._menu = (elt && Menu.for(elt)) || null;
        }
        return this._menu;
    }

    public static Anchor = Anchor;
    public static Menu = Menu;
    public static Item = Item;

    public constructor(...args) {
        let element: Optional<string | HTMLElement | object> = undefined;
        let config: FlyoutConfig = {};
        if (args.length) {
            if (args[0] instanceof HTMLElement || typeof args[0] === 'string') {
                [element, config = {}] = args;
            } else {
                [config] = args;
                // TODO can this be generalized gracefully and pushed back up the chain through to StatefulComponent?
                element = _Object.excludeProperties(config, ['position']);
                config = _Object.includeProperties(config, ['position']);
            }
        }
        super(element);

        this._anchor = null;
        this._menu = null;

        this.element.classList.add(
            'flyout',
            ...(config?.position || 'auto').split('-')
        );
    }

    render(children?: Element[]) {
        this.element = super.render(children);
        if (!this.element.querySelector('.scrim')) {
            this.element.appendChild(<Scrim onclick={() => this.close()} />);
        }
        return this.element;
    }

    public async open() {
        this.element.classList.add('open');

        const anchor = this.anchor;
        const menu = this.menu;

        if (this.element.classList.contains('auto') && anchor && menu) {
            const anchorBounds = anchor.element.getBoundingClientRect(),
                menuBounds = menu.element.getBoundingClientRect(),
                classList = this.element.classList,
                menuStyle = menu.htmlElement?.style,
                windowWidth = document.documentElement.clientWidth,
                windowHeight = document.documentElement.clientHeight,
                left = anchorBounds.x,
                right = windowWidth - anchorBounds.x,
                top = anchorBounds.y,
                bottom = windowHeight - anchorBounds.y,
                zero = '0px';

            if (menuBounds.height < windowHeight) {
                if (menuBounds.height <= bottom) {
                    classList.add('bottom');
                } else if (menuBounds.height <= top) {
                    classList.add('top');
                } else if (top > bottom && bottom < menuBounds.height / 2) {
                    menuStyle!.bottom = zero;
                } else if (top < bottom && top < menuBounds.height / 2) {
                    menuStyle!.top = zero;
                } // otherwise, it will be centered vertically on the anchor
            } else {
                menuStyle!.top = zero;
            }

            if (menuBounds.width < windowWidth) {
                if (menuBounds.width <= right) {
                    classList.add('right');
                } else if (menuBounds.width <= left) {
                    classList.add('left');
                } else if (left > right && right < menuBounds.width / 2) {
                    menuStyle!.right = zero;
                } else if (left < right && left < menuBounds.width / 2) {
                    menuStyle!.left = zero;
                } // otherwise, it will be centered horizontally on the anchor
            } else {
                menuStyle!.left = zero;
            }
        }

        this.htmlElement?.style.setProperty(
            '--anchor-height',
            `${anchor?.element.clientHeight}px`
        );
        this.htmlElement?.style.setProperty(
            '--anchor-width',
            `${anchor?.element.clientWidth}px`
        );
        this.htmlElement?.style.setProperty(
            '--menu-height',
            `${menu?.element.clientHeight}px`
        );
        this.htmlElement?.style.setProperty(
            '--menu-width',
            `${menu?.element.clientWidth}px`
        );
    }

    public close() {
        this.element.classList.remove('open');
        const menu = this.menu;
        if (this.element.classList.contains('auto') && menu) {
            'top bottom left right'
                .split(' ')
                .forEach(dir => this.element.classList.remove(dir));
            menu.htmlElement?.style.removeProperty('top');
            menu.htmlElement?.style.removeProperty('left');
        }
    }
}
