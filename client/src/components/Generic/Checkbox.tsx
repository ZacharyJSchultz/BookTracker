import React from "react";

import { CheckboxProps } from "../../types/PropTypes";

function Checkbox({ id, handleChange, children }: CheckboxProps) {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id={id}
                onChange={handleChange}
            ></input>
            <label htmlFor={id} className="form-check-label">
                {children}
            </label>
        </div>
    );
}

export default Checkbox;
