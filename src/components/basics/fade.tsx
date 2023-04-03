import React,
{
    cloneElement,
    CSSProperties,
    FC,
    ReactElement,
    RefObject,
    useState
} from "react"
import { Transition } from "react-transition-group"
import {
    EnterHandler,
    ExitHandler,
    TimeoutProps
} from "react-transition-group/Transition"
import { classnames } from "../utils"
import { isChildrenValidElement } from "../utils/react"

interface FadeProps extends Partial<TimeoutProps<HTMLElement>> {
    fadeClass?: string
    showClass?: string
    showDisplay?: string
    children: ReactElement
}

const Fade: FC<FadeProps> = ({
    fadeClass = "fade",
    showClass = "show",
    children,
    timeout = 150,
    showDisplay,
    nodeRef,
    unmountOnExit,
    onEnter,
    onEntering,
    onExit,
    onExited,
    ...restProps
}) => {
    if (!isChildrenValidElement(children)) {
        return null
    }

    const [
        display,
        setDisplay
    ] = useState(unmountOnExit ? "" : "none")
    const style: CSSProperties = {
        ...children.props.style
    }
    const [classes, setClasses] = useState(fadeClass)
    const handleEnter: EnterHandler<HTMLElement> = (...args) => {
        if (!unmountOnExit) {
            setDisplay(showDisplay ?? "")
        }

        onEnter?.(...args)
    }
    const handleEntering: EnterHandler<HTMLElement> = (...args) => {
        const el = (nodeRef as RefObject<HTMLElement>)?.current

        //reflow
        el?.offsetHeight
        setClasses(classnames(fadeClass, showClass))
        onEntering?.(...args)
    }
    const handleExit: ExitHandler<HTMLElement> = (...args) => {
        setClasses(fadeClass)
        onExit?.(...args)
    }
    const handleExited: ExitHandler<HTMLElement> = (...args) => {
        if (!unmountOnExit) {
            setDisplay("none")
        }

        onExited?.(...args)
    }

    if(display) {
        style.display = display
    }

    return (
        <Transition
            timeout={timeout}
            onEnter={handleEnter}
            onEntering={handleEntering}
            onExit={handleExit}
            onExited={handleExited}
            unmountOnExit={unmountOnExit}
            {...restProps}>
            {
                cloneElement(
                    children,
                    {
                        className: classnames(
                            children.props.className,
                            classes
                        ),
                        style
                    }
                )
            }
        </Transition>
    )
}

export default Fade