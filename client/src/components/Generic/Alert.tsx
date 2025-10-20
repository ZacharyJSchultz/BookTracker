import "../../App.scss";

import React from "react";
import {
    CheckCircleFill,
    ExclamationTriangleFill
} from "react-bootstrap-icons";

import { AlertProps } from "../../types";

const getAlertIcon = (alertType: string) => {
    return alertType.includes("danger") ? (
        <ExclamationTriangleFill className="error-alert-icon" />
    ) : (
        <CheckCircleFill className="success-alert-icon" />
    );
};

const Alert = ({
    alertType = "alert-primary",
    strongtext = "",
    children = "",
    onClose
}: AlertProps) => {
    return (
        <>
            <div
                className={alertType.concat(
                    " ",
                    "alert alert-dismissible fade show"
                )}
                role="alert"
            >
                <div>{getAlertIcon(alertType)}</div>
                <div>
                    <strong className="alert-strongtext">{strongtext}!</strong>{" "}
                    {children}
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                        onClick={onClose}
                    ></button>
                </div>
            </div>
        </>
    );
};

export default Alert;
