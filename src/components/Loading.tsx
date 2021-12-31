import JSXFactory, { JSXComponent, render } from '@battis/jsx-factory';
import Visual from '../stylesheets/Visual';
import Icon from './Icon';

export default class Loading implements JSXComponent {
    private props = { fullpage: false };

    constructor(props?) {
        this.props = { ...props };
    }

    public render() {
        if (this.props.fullpage) {
            return Visual.goldenCenter(<Icon.Loading />);
        }
        return <Icon.Loading />;
    }
}

export const LoadingPage = () => <Loading fullpage={true} />;
export const renderLoadingPage = () => {
    if (
        !document.querySelector(
            `${process.env.ROOT_SELECTOR} > .golden-wrapper .loading`
        )
    ) {
        render(<LoadingPage />);
    }
};
