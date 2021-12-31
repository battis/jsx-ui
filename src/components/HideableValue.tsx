import { Component } from '@battis/jsx-components';
import JSXFactory from '@battis/jsx-factory';
import Visual from '../stylesheets/Visual';

type HideableValueConfig = {
    [key: string]: any;
    isHidden?: () => boolean;
    isShown?: () => boolean;
    tagName?: string;
};

export default class HideableValue extends Component {
    private isHidden: () => boolean;

    constructor({
        isHidden,
        isShown,
        tagName: TagName = 'span',
        ...props
    }: HideableValueConfig) {
        super(<TagName {...props} />);
        if (isHidden) {
            this.isHidden = isHidden;
        } else if (isShown) {
            this.isHidden = () => !isShown();
        } else {
            this.isHidden = () => false;
        }
        this.isHidden() && Visual.hide(this.element);
    }

    public setElement(element) {
        if (element !== this._element) {
            new MutationObserver(() => {
                Visual.toggleHide(element, this.isHidden());
            }).observe(element, { childList: true });
        }
        super.setElement(element);
    }
}
