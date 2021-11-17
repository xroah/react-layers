import * as React from "react"
import {bool, oneOf} from "prop-types"
import classNames from "reap-utils/lib/class-names"
import {
    BgColor,
    bgColors,
    CSSComponentProps
} from "../Commons/consts-and-types"
import {cloneWithClass, onlyChild} from "../Commons/utils"
import {cssCompPropTypes} from "../Commons/prop-types"

interface BgProps extends CSSComponentProps {
    variant?: BgColor
    gradient?: boolean
    children: React.ReactElement
}

export default function Background(
    {
        variant,
        gradient,
        children,
        className
    }: BgProps
) {
    const c = onlyChild(children)
    const classes = classNames(
        variant && `bg-${variant}`,
        gradient && "bg-gradient"
    )

    return cloneWithClass(c, className, classes)
}

Background.propTypes = {
    ...cssCompPropTypes,
    variant: oneOf(bgColors),
    gradient: bool
}