import * as React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Collapse from "./Collapse";
import {handleFuncProp, AccordionContext} from "./utils";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    header: React.ReactNode;
    __key__?: string | number; //internal only
    __onHeaderClick__?: Function; //internal only
}

export default class AccordionPanel extends React.Component<PanelProps> {

    static propTypes = {
        header: PropTypes.node.isRequired
    };
    static contextType = AccordionContext;

    handleHeaderClick = () => {
        const {
            __key__,
            __onHeaderClick__
        } = this.props;
        const fn = handleFuncProp(__onHeaderClick__);

        fn(__key__);
    };

    render() {
        const {
            header,
            children,
            className,
            __key__,
            ...otherProps
        } = this.props;

        delete otherProps.__onHeaderClick__;

        return (
            <div className={classNames(className, "card")} {...otherProps}>
                <div
                    style={{cursor: "pointer"}}
                    className="card-header"
                    onClick={this.handleHeaderClick}>{header}</div>
                <Collapse isOpen={this.context.has(__key__)}>
                    <div className="card-body">
                        {children}
                    </div>
                </Collapse>
            </div>
        );
    }

}