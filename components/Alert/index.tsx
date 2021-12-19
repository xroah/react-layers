import * as React from "react"
import {
    bool,
    node,
    func
} from "prop-types"
import classNames from "reap-utils/lib/class-names"
import {AnchorAttrs, WithVariantProp} from "../Commons/consts-and-types"
import Button from "../Button"
import {isUndef} from "reap-utils/lib"
import {
    Fade,
    NoTransition,
    createComponent
} from "reap-utils/lib/react"
import {omit} from "reap-utils/lib"
import {getFunction} from "reap-utils/lib/react"
import {getPrefixFunc} from "../Commons/utils"
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

interface AlertComponent<T> extends React.FunctionComponent<T> {
    Link: React.FunctionComponent<AnchorAttrs>
}

const Alert: AlertComponent<AlertProps> = (
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
    }
) => {
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
        getFunction(onClosed)()
    }
    const handleExit = () => {
        getFunction(onClose)()
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

    return fade ?
        <Fade {...transitionProps} /> :
        <NoTransition {...transitionProps} />
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

Alert.Link = createComponent({
    tag: "a",
    displayName: "AlertLink",
    className: "alert-link"
})

export default Alert