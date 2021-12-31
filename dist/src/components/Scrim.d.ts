import { Component } from '@battis/jsx-components';
import './Scrim.scss';
declare type ScrimConfig = {
    [key: string]: any;
    zIndex?: number;
};
export default class Scrim extends Component {
    constructor({ zIndex, ...rest }: ScrimConfig);
}
export {};
