import React, {
    FunctionComponent,
    ReactNode,
    isValidElement
} from "react";
import { FooterProps } from "./types";
import Button from "r-layers/basics/button";

type Props = FooterProps & { defaultFooter: ReactNode }

const Footer: FunctionComponent<Props> = (
    {
        okText,
        cancelText,
        onOk,
        onCancel,
        defaultFooter,
        footerBtnSize
    }
) => {
    if (defaultFooter === null) {
        return null
    }

    const CLASS_NAME = "modal-footer"

    if (defaultFooter) {
        if (isValidElement(defaultFooter)) {
            return defaultFooter
        }

        return <div className={CLASS_NAME}>{defaultFooter}</div>
    }

    return (
        <div className="modal-footer">
            <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                size={footerBtnSize}>
                {cancelText}
            </Button>
            <Button
                type="button"
                onClick={onOk}
                size={footerBtnSize}>
                {okText}
            </Button>
        </div>
    )
}

export default Footer