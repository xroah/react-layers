import * as React from "react"
import classNames from "reap-utils/lib/class-names"
import PropTypes from "prop-types"
import {
    sizes,
    ValueOf,
    Variant,
    variants
} from "../Commons/consts-and-types"
import {getPrefixFunc} from "../Commons/utils"

const _sizes = ["xs", ...sizes]
const animations = ["grow", "wave"] as const

interface PlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: string | number
    variant?: Variant
    size?: ValueOf<typeof _sizes>
    animation?: ValueOf<typeof animations>
}

export default function Placeholder(
    {
        width,
        variant,
        size,
        animation,
        className,
        style = {},
        children,
        ...restProps
    }: PlaceholderProps
) {
    const prefix = getPrefixFunc("placeholder")
    const classes = classNames(
        className,
        prefix(),
        variant && `bg-${variant}`,
        size && prefix(size),
    )
    const placeholder = <span className={classes} />

    if (width) {
        style.width = width
    }

    if (animation) {
        const Wrapper = (props: React.HTMLAttributes<HTMLDivElement>) => (
            <div
                className={prefix(animation)}
                style={style}
                {...restProps}
                {...props} />
        )
        if (children) {
            return <Wrapper>{children}</Wrapper>
        }

        return <Wrapper>{placeholder}</Wrapper>
    }

    return React.cloneElement(
        placeholder,
        {
            style,
            ...restProps
        }
    )
}

Placeholder.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    variant: PropTypes.oneOf(variants),
    size: PropTypes.oneOf(_sizes),
    animation: PropTypes.oneOf(animations)
}