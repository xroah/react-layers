import * as React from "react"
import classNames from "reap-utils/lib/class-names"
import PropTypes from "prop-types"

interface ItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    active?: boolean
    disabled?: boolean
}

export default function PaginationItem(
    {
        active,
        disabled,
        className,
        style,
        href,
        children,
        ...restProps
    }: ItemProps
) {
    const classes = classNames(
        className,
        "page-item",
        active && "active",
        disabled && "disabled"
    )

    return (
        <li style={style} className={classes}>
            <a href={href} className="page-link" {...restProps}>
                {children}
            </a>
        </li>
    )
}