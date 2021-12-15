import * as React from "react"
import {Fade, NoTransition} from "reap-utils/lib/react"
import {
    AnimProps,
    AutoHideProps,
    CommonTransitionProps,
    Events,
} from "../Commons/common-types"
import ToastInner, {ToastInnerProps} from "./Inner"

export type ToastProps = CommonTransitionProps & ToastInnerProps &
    Events & AutoHideProps & AnimProps

export default function Toast(
    {
        visible,
        icon,
        title,
        extra,
        closable,
        animation,
        unmountOnExit,
        hideOnExit,
        onShow,
        onShown,
        onHidden,
        onHide,
        onClose,
        ...restProps
    }: ToastProps
) {
    const ref = React.useRef<HTMLDivElement>(null)
    const child = (
        <ToastInner
            visible={visible}
            icon={icon}
            title={title}
            extra={extra}
            closable={closable}
            nodeRef={ref}
            onClose={onClose}
            {...restProps} />
    )
    const fadeProps = {
        in: !!visible,
        appear: true,
        unmountOnExit,
        hideOnExit,
        nodeRef: ref,
        children: child,
        onEnter: onShow,
        onEntered: onShown,
        onExit: onHide,
        onExited: onHidden
    }

    return animation ?
        <Fade {...fadeProps} /> :
        <NoTransition {...fadeProps} />
}

Toast.defaultProps = {
    fade: true,
    hideOnExit: true
}