import React from "react";

import { TableHeaderElementProps } from "../../types";

// Note: Naming a prop "key" gives it special React properties, meaning that the value doesn't ACTUALLY get passed...
// it's only used by the DOM, so it'll be undefined if you actually try to use it
function TableHeaderElement({
    handleSort,
    sortDir,
    colKey,
    children
}: TableHeaderElementProps) {
    let noWrapSpaces = String(children).replace(" ", "\u00A0"); // Replaces regular spaces with ones that prevent wrapping, to make the front-end look better

    return (
        <th scope="col" className="text-center">
            <div className="table-header-element-inner-div">
                &nbsp;
                <span className="align-middle the-span">{noWrapSpaces}</span>
                &ensp;
                <button
                    type="button"
                    className="btn btn-sm btn-secondary float-end sort-button"
                    aria-label="Sort"
                    onClick={() => handleSort(colKey)}
                >
                    <b className="sort-button-arrow">{sortDir ? "🡓" : "🡑"}</b>
                </button>
                &nbsp;
            </div>
        </th>
    );
}

export default TableHeaderElement;
