import React, {
    isValidElement,
    RefObject,
    FC,
    ReactElement,
    useState,
    CSSProperties,
    cloneElement,
    useCallback,
    useLayoutEffect,
} from "react"
import { createPortal } from "react-dom"
import {
    computePosition,
    autoUpdate,
    flip as flipMiddleware,
    offset as offsetMiddleware,
    arrow as arrowMiddleWare,
    shift,
    inline,
    Placement,
    ComputePositionReturn,
    limitShift
} from "@floating-ui/dom"
import Fade from "../basics/fade"
import { noop } from "r-layers/utils"
import {
    arrayOf,
    bool,
    element,
    instanceOf,
    number,
    oneOfType,
    shape,
    string,
    Requireable,
    Validator,
    oneOf
} from "prop-types"
import NoTransition from "../basics/no-transition"
import { ToggleEvents } from "../commons/types"

export interface PopupProps extends ToggleEvents {
    floatingRef: RefObject<HTMLElement>
    overlay: ReactElement
    flipAlignment?: boolean
    anchorRef: RefObject<HTMLElement>
    arrowRef?: RefObject<HTMLElement>
    children: ReactElement
    offset?: number | number[]
    flip?: boolean
    transition?: boolean
    transitionClass?: string
    timeout?: number
    placement?: Placement
    visible?: boolean
    fallbackPlacements?: Placement[]
    inline?: boolean
    unmountOnHidden?: boolean
    onUpdate?: (data: ComputePositionReturn) => void
}

const Popup: FC<PopupProps> = (
    {
        visible,
        transition = true,
        transitionClass,
        offset,
        anchorRef,
        floatingRef,
        children,
        overlay,
        timeout,
        fallbackPlacements,
        arrowRef,
        flipAlignment = true,
        flip = true,
        placement = "bottom",
        unmountOnHidden = true,
        inline: inlineProp,
        onUpdate,
        onShow,
        onShown,
        onHide,
        onHidden
    }: PopupProps
) => {
    if (!isValidElement(children)) {
        return children
    }

    const [pos, setPos] = useState<CSSProperties>({
        position: "absolute",
        left: 0,
        top: 0
    })
    const getOffset = useCallback(
        () => {
            if (offset) {
                if (Array.isArray(offset)) {
                    if (!offset.length) {
                        return false
                    }

                    if (offset.length === 1) {
                        return [offset[0], offset[0]]
                    }

                    return offset
                }

                return [offset, offset]
            }

            return false
        },
        [offset]
    )
    const updatePosition = () => {
        const offset = getOffset()

        computePosition(
            anchorRef.current!,
            floatingRef.current!,
            {
                middleware: [
                    offset && offsetMiddleware({
                        mainAxis: offset[0],
                        crossAxis: offset[1]
                    }),
                    inline(),
                    flip && flipMiddleware({
                        fallbackPlacements,
                        flipAlignment
                    }),
                    shift({
                        limiter: limitShift()
                    }),
                    arrowRef?.current && arrowMiddleWare({
                        element: arrowRef.current
                    }),
                ],
                placement
            }
        ).then(({ x, y, ...rest }) => {
            setPos({
                ...pos,
                transform: `translateX(${x}px) translateY(${y}px)`
            })
            onUpdate?.({
                x,
                y,
                ...rest
            })
        })
    }
    const newOverlay = cloneElement(
        overlay,
        {
            style: {
                ...overlay.props.style,
                ...pos
            }
        }
    )
    const transitionProps = {
        in: visible,
        unmountOnExit: unmountOnHidden,
        onEnter: onShow,
        onEntered: onShown,
        onExit: onHide,
        onExited: onHidden
    }
    const el = (
        transition ? (
            <Fade
                timeout={timeout}
                nodeRef={floatingRef}
                fadeClass={transitionClass}
                appear
                {...transitionProps}>
                {newOverlay}
            </Fade>
        ) : (
            <NoTransition {...transitionProps}>
                {newOverlay}
            </NoTransition>
        )
    )

    useLayoutEffect(
        () => {
            let cleanup = noop

            if (visible) {
                if (floatingRef.current && anchorRef.current) {
                    cleanup = autoUpdate(
                        anchorRef.current,
                        floatingRef.current,
                        updatePosition
                    )
                }
            }

            return cleanup
        },
        [visible]
    )

    return (
        <>
            {children}
            {inlineProp ? el : createPortal(el, document.body)}
        </>
    )
}

const refType = shape({
    current: instanceOf(HTMLElement) as Validator<HTMLElement | null>
}).isRequired

Popup.propTypes = {
    anchorRef: refType,
    floatingRef: refType,
    overlay: element.isRequired,
    children: element.isRequired,
    offset: oneOfType([
        number,
        arrayOf(number) as (Requireable<number[]>)
    ]),
    flip: bool,
    transition: bool,
    transitionClass: string,
    timeout: number,
    visible: bool,
    inline: bool,
    unmountOnHidden: bool,
    placement: oneOf([
        "top",
        "bottom",
        "left",
        "right",
        "top-start",
        "top-end",
        "bottom-start",
        "bottom-end",
        "left-start",
        "left-end",
        "right-start",
        "right-end"
    ])
}

export default Popup