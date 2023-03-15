import React from "react"
import { Transition, TransitionStatus } from "react-transition-group"
import Alert, { AlertProps } from "../basics/alert"
import { ToggleEvents } from "../commons/types"
import { number } from "prop-types"
import { classnames, omit } from "../utils"

const DEFAULT_DURATION = 3000
export const WRAPPER_CLASS = "r-message-wrapper"

export interface MessageProps extends AlertProps, ToggleEvents {
    duration?: number
    visible?: boolean
}

class Message extends React.Component<MessageProps> {
    private timer = -1
    static propTypes = {
        duration: number
    }

    clearTimeout() {
        if (this.timer !== -1) {
            window.clearTimeout(this.timer)

            this.timer = -1
        }
    }

    close = () => {
        this.clearTimeout()
        this.props.onClose?.()
    }

    componentDidMount() {
        const { duration = DEFAULT_DURATION } = this.props

        if (duration! > 0) {
            this.timer = window.setTimeout(
                this.close,
                duration
            )
        }
    }

    componentWillUnmount() {
        this.clearTimeout()
    }

    render() {
        const {
            onShow,
            onShown,
            className,
            onHide,
            onHidden,
            visible,
            ...restProps
        } = this.props
        const render = (s: TransitionStatus) => {
            const show = s === "entering" || s === "entered"
            const classes = classnames(
                className,
                "r-message-item",
                show && "show"
            )

            return (
                <div className={classes}>
                    <Alert onClose={this.close} {...restProps} />
                </div>
            )
        }

        omit(restProps, ["duration", "onClose"])
        
        return (
            <Transition
                in={visible}
                timeout={200}
                onEnter={onShow}
                onEntered={onShown}
                onExit={onHide}
                onExited={onHidden}
                appear
                unmountOnExit>
                {render}
            </Transition>
        )
    }
}

export default Message