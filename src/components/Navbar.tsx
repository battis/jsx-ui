import path from 'path';
import JSXFactory, { JSXComponent } from '@battis/jsx-factory';
import { _DOM } from '@battis/monkey-patches';
import { Browser } from '@battis/jsx-lib';
import Routing from '@battis/jsx-routing';
import './Navbar.scss';

type NavbarConfig = { links?: object };

// TODO collapse to hamburger menu responsively?
// TODO horizontal scroll rather than reflowing?
/**
 * Navigation bar
 *
 * ```JSX
 * <Navbar links={{foo: 'path/to/foo', bar: 'path/to/bar'}}>
 *     <h1>Title</h1>
 * </Navbar>
 * <Navbar.NavbarBody>
 *     ...page content...
 * </Navbar.NavbarBody>
 * ```
 */
export default class Navbar implements JSXComponent {
    public static NavbarBody = class implements JSXComponent {
        element: HTMLElement = (<div class="navbar body" />);

        render(children?) {
            this.element = <div class="navbar body">{children}</div>;
            const root = document.querySelector(
                process.env.ROOT_SELECTOR || '#root'
            );
            if (root) {
                new MutationObserver(
                    this.resizeTopMarginWhenAttachedToDom.bind(
                        this,
                        this.element
                    )
                ).observe(root, {
                    attributes: false,
                    childList: true,
                    subtree: true
                });
            }
            return this.element;
        }

        calculateMarginTop(navbarHeight: number) {
            // TODO would be even better to figure out which CSSStyleRule actually applies...
            let marginTop = '0';
            for (const rule of _DOM.getStylesFor(this.element)) {
                marginTop = rule.style.marginTop || marginTop;
            }
            return `calc(${navbarHeight}px + ${marginTop})`;
        }

        resizeTopMarginWhenAttachedToDom(
            element: HTMLElement,
            mutations: MutationRecord[],
            observer: MutationObserver
        ) {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.contains(element)) {
                        observer.disconnect();
                        const navbar =
                            element.parentElement?.querySelector('.navbar');
                        if (navbar) {
                            element.style.marginTop = this.calculateMarginTop(
                                navbar.clientHeight
                            );
                            new ResizeObserver(
                                this.resizeTopMarginWhenNavbarResizes.bind(
                                    this,
                                    element,
                                    navbar
                                )
                            ).observe(navbar);
                        }
                    }
                });
            }
        }

        resizeTopMarginWhenNavbarResizes(element, navbar) {
            element.style.marginTop = this.calculateMarginTop(
                navbar.clientHeight
            );
        }
    };

    protected links: object;

    public constructor(...args) {
        const [config]: NavbarConfig[] = args;
        this.links = config?.links || {};
    }

    public render(children?) {
        const element = (
            <div class="navbar fixed light gray shadow">
                <div class="links">
                    {Object.getOwnPropertyNames(this.links).map(key => {
                        const href = path.join(Routing.root, this.links[key]);
                        return href === location.pathname ? (
                            <span class="link active">{key}</span>
                        ) : (
                            <a class="link" href={href}>
                                {key}
                            </a>
                        );
                    })}
                </div>
                {children}
            </div>
        );
        Browser.iOS.mobileSafariKeyboardFixedElement(element);
        return element;
    }
}
