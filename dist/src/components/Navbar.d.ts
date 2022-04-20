import { JSXComponent } from "@battis/jsx-factory";
import "./Navbar.scss";
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
    static NavbarBody: {
        new (): {
            element: HTMLElement;
            render(children?: any): HTMLElement;
            calculateMarginTop(navbarHeight: number): string;
            resizeTopMarginWhenAttachedToDom(element: HTMLElement, mutations: MutationRecord[], observer: MutationObserver): void;
            resizeTopMarginWhenNavbarResizes(element: any, navbar: any): void;
        };
    };
    protected links: object;
    constructor(...args: any[]);
    render(children?: any): any;
}
