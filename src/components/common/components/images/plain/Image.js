import React from "react";

const LAZY_LOAD_PICTURE = "public/pictures/slds-brand-spinner.gif";

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.handleRef = this.handleRef.bind(this);
        this.state = {
            src: LAZY_LOAD_PICTURE
        };
    }

    componentDidMount() {
        const imageElement = this._img;
        if (!!imageElement && "IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.setState({src: this.props.src}, _ => {
                            lazyImageObserver.unobserve(entry.target);
                        });
                    }
                });
            });
            lazyImageObserver.observe(imageElement);
        } else {
            this.setState({src: this.props.src});
        }
    }

    componentDidUpdate(prevProps) {
        const prevSrc = prevProps.src, {src} = this.props;
        if (!!prevSrc && !!src && prevSrc !== src) {
            this.setState({src: src});
        }
    }

    handleRef(element) {
        this._img = element;
        const {imgRef} = this.props;
        if (!!imgRef && typeof imgRef === "function") {
            // Share reference to "img" element to outer consumer;
            imgRef(element);
        }
    }

    render() {
        const {title, className, onClick} = this.props;
        return (
            <img title={title}
                 style={{borderRadius: "5px", maxHeight: "50vh"}}
                 className={className}
                 alt={title}
                 src={this.state.src}
                 ref={this.handleRef}
                 onClick={onClick}/>
        );
    }
}

export default Image;