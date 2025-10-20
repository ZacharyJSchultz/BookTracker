import React, { ReactElement } from "react";

import { ModalProps } from "../../types";

function Modal({
    modal,
    modalTitle,
    modalBody,
    yesButton,
    noButton,
    yesButtonClasses = "btn-primary",
    noButtonClasses = "btn-secondary",
    onYes,
    onNo
}: ModalProps) {
    return (
        <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-label="Remove Modal"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${modal}ModalLabel`}>
                            {modalTitle}
                        </h5>
                    </div>
                    <div className="modal-body">{modalBody}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className={"btn " + yesButtonClasses}
                            onClick={onYes}
                        >
                            {yesButton}
                        </button>
                        <button
                            type="button"
                            className={"btn " + noButtonClasses}
                            onClick={onNo}
                        >
                            {noButton}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
