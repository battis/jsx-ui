import Visual from '../stylesheets/Visual';
import { Component } from '@battis/jsx-components';

type Selector = (element: Element) => boolean;
type KeyedViewConfig = object & { isSelected: Selector };

export default class KeyedView extends Component {
    private isSelected;

    constructor({ isSelected, ...props }: KeyedViewConfig) {
        super({ ...props });
        this.isSelected = isSelected;
    }

    public setElement(element: Element) {
        if (element !== this._element) {
            new MutationObserver((mutations) => {
                for (
                    let i = 0;
                    this._element && i < this._element.children.length;
                    i++
                ) {
                    const child = this._element.children.item(i);
                    if (child && child instanceof Element) {
                        if (this.isSelected(child)) {
                            Visual.unhide(child);
                        } else {
                            Visual.hide(child);
                        }
                    }
                }
            }).observe(this.element, {
                childList: true,
                subtree: true
            });
        }
        super.setElement(element);
    }
}
