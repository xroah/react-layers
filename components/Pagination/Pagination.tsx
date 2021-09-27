import React from "react"
import classNames from "reap-utils/lib/class-names"
import PropTypes from "prop-types"
import {Size, sizes} from "../Commons/consts-and-types"

type BaseProps = Omit<React.HTMLAttributes<HTMLUListElement>, "size">

interface PaginationProps extends BaseProps {
    size?: Size
}

export default function Pagination(
    {
        size,
        className,
        children,
        ...restProps
    }: PaginationProps
) {
    const classes = classNames(
        "pagination",
        size && `pagination-${size}`
    )

    return (
        <ul className={classes} {...restProps}>
            {children}
        </ul>
    )
}

Pagination.propTypes = {
    size: PropTypes.oneOf(sizes)
}