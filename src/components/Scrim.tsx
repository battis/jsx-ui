import { Component } from '@battis/jsx-components';
import './Scrim.scss';

type ScrimConfig = { [key: string]: any; zIndex?: number };

export default class Scrim extends Component {
    public constructor({ zIndex, ...rest }: ScrimConfig) {
        super({ ...rest });
        this.element.classList.add('scrim');
        zIndex &&
            this.htmlElement?.style.setProperty('--z-index', zIndex.toString());
    }
}
