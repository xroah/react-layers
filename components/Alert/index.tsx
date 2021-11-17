import * as React from "react"
import {
    bool,
    node,
    func
} from "prop-types"
import classNames from "reap-utils/lib/class-names"
import {WithVariantProp} from "../Commons/consts-and-types"
import Button from "../Button"
import isUndef from "reap-utils/lib/is-undef"
import Fade from "../Commons/Fade"
import NoTransition from "../Commons/NoTransition"
import omit from "reap-utils/lib/omit"
import handleFuncProp from "reap-utils/lib/react/handle-func-prop"
import {createComponent, getPrefixFunc} from "../Commons/utils"
import {variantPropType} from "../Commons/prop-types"

type BtnClickEvt = React.MouseEvent<HTMLButtonElement>

export interface AlertProps extends WithVariantProp<HTMLDivElement> {
    fade?: boolean
    dismissible?: boolean
    visible?: boolean
    heading?: string | React.ReactNode
    onClose?: Function
    onClosed?: Function
    onCloseButtonClick?: (evt: BtnClickEvt) => void
}

export default function Alert(
    {
        className,
        variant,
        fade,
        dismissible,
        children,
        heading,
        onClose,
        onClosed,
        onCloseButtonClick,
        ...restProps
    }: AlertProps
) {
    const prefix = getPrefixFunc("alert")
    const classes = classNames(
        className,
        prefix(),
        variant && prefix(variant),
        dismissible && prefix("dismissible")
    )
    const controlled = "visible" in restProps
    const [_visible, updateVisible] = React.useState(true)
    const handleClick = (evt: BtnClickEvt) => {
        if (!controlled) {
            updateVisible(!_visible)
        }

        if (typeof onCloseButtonClick === "function") {
            onCloseButtonClick(evt)
        }
    }
    const handleExited = () => {
        handleFuncProp(onClosed)()
    }
    const handleExit = () => {
        handleFuncProp(onClose)()
    }
    const getElement = (closeBtn?: React.ReactNode) => {
        const props = {...restProps}

        return (
            <div
                className={classes}
                {...omit(props, "visible")}>
                {
                    !isUndef(heading) && (
                        <h4 className={prefix("heading")}>
                            {heading}
                        </h4>
                    )
                }
                {children}
                {closeBtn}
            </div>
        )
    }
    let closeBtn: React.ReactNode

    if (dismissible) {
        closeBtn = (
            <Button
                variant="link"
                type="button"
                className="btn-close"
                onClick={handleClick} />
        )
    }

    if (!controlled && !dismissible) {
        return getElement()
    }

    const transitionProps = {
        in: controlled ? !!restProps.visible : _visible,
        unmountOnExit: true,
        onExit: handleExit,
        onExited: handleExited,
        children: getElement(closeBtn)
    }

    return React.createElement(
        fade ? Fade : NoTransition,
        transitionProps
    )
}

Alert.propTypes = {
    variant: variantPropType,
    fade: bool,
    heading: node,
    dismissible: bool,
    visible: bool,
    onClose: func,
    onClosed: func
}
Alert.defaultProps = {
    fade: true
}

Alert.Link = createComponent<React.AnchorHTMLAttributes<HTMLAnchorElement>>({
    tag: "a",
    displayName: "AlertLink",
    className: "alert-link"
})