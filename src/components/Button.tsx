import JSXFactory, { JSXFunction } from '@battis/jsx-factory';
import './Button.scss';

const Button: JSXFunction = (props, children) => {
    props.class += ' button';
    return <button {...props}>{children}</button>;
}

export default Button;
