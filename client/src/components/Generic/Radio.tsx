import React from "react";

import { RadioProps } from "../../types/PropTypes";

function Radio({ id, handleChange, checked, children }: RadioProps) {
    return (
        <div className="form-check">
            <input
                type="radio"
                className="form-check-input"
                name="main-genres"
                id={id}
                onChange={handleChange}
                checked={checked}
            ></input>
            <label htmlFor={id} className="form-check-label">
                {children}
            </label>
        </div>
    );
}

export default Radio;
