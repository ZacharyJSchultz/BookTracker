import React, { ReactElement } from "react";
import { ModalProps } from "../../types";

function Modal({
    modal,
    modalTitle,
    modalBody,
    yesButton,
    noButton,
    onYes,
    onNo,
}: ModalProps) {
    return (
        <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-labelledby={`${modal}Modal`}
            aria-hidden="true"
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
                            className="btn btn-secondary"
                            onClick={onYes}
                        >
                            {yesButton}
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
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
