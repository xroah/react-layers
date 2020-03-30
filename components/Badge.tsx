import * as React from "react";
import {classNames, variantType, variantArray} from "./utils";
import PropTypes from "prop-types";
import { AnchorCommonProps } from "./CommonPropsInterface";

export interface BadgeProps extends AnchorCommonProps<HTMLSpanElement & HTMLAnchorElement> {
    variant?: variantType;
    pill?: boolean;
}

export default function Badge(props: BadgeProps) {
    const {
        className,
        variant,
        pill,
        href,
        children,
        ...otherProps
    } = props;
    const classes = classNames(
        className,
        "badge",
        variant && `badge-${variant}`,
        pill && "badge-pill"
    );
    let tag = "span";

    if (href) {
        tag = "a";
    }

    return React.createElement(
        tag,
        {
            href,
            className: classes,
            ...otherProps
        },
        children
    );
}

Badge.propTypes = {
    variant: PropTypes.oneOf(variantArray),
    pill: PropTypes.bool,
    href: PropTypes.string
};
Badge.defaultProps = {
    pill: false
};