import { HTMLAttributes, ButtonHTMLAttributes } from "react"
import { closeTypes, sizes, variants } from "./constants"

export type OneOf<T extends ReadonlyArray<unknown>> = T[number]

export type DivProps = HTMLAttributes<HTMLDivElement>

export type CloseType = OneOf<typeof closeTypes>

export interface ToggleEvents {
    onShow?: VoidFunction
    onShown?: VoidFunction
    onHide?: VoidFunction
    onHidden?: VoidFunction
}

export interface ClosableProps {
    visible?: boolean
    closable?: boolean
    onClose?: VoidFunction
}
export interface LayerProps extends
    ToggleEvents, DivProps, ClosableProps {
    backdrop?: boolean | "static"
    keyboard?: boolean
    onClose?: (type?: CloseType) => unknown
}

export interface ButtonProps extends
    ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: OneOf<typeof variants>
    size?: OneOf<typeof sizes>
    disabled?: boolean
}