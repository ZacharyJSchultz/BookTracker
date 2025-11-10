import React from "react";

import { TableHeaderElementProps } from "../../types/PropTypes";

// Note: Naming a prop "key" gives it special React properties, meaning that the value doesn't ACTUALLY get passed...
// it's only used by the DOM, so it'll be undefined if you actually try to use it
function TableHeaderElement({
    handleSort = () => {},
    sortDir = null,
    colKey,
    showSortButton = true,
    minWidth = "none",
    maxWidth = "none",
    centerText = false,
    children = ""
}: TableHeaderElementProps) {
    const noWrapSpaces = String(children).replace(" ", "\u00A0"); // Replaces regular spaces with ones that prevent wrapping, to make the front-end look better
    const spanClasses = `align-middle the-span${
        centerText ? " text-center" : ""
    }`;
    return (
        <th
            scope="col"
            className="text-center"
            key={colKey}
            style={{ minWidth: minWidth, maxWidth: maxWidth }}
        >
            <div className="the-inner-div">
                &nbsp;
                <span className={spanClasses}>{noWrapSpaces}</span>
                {showSortButton && (
                    <>
                        &ensp;
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary float-end sort-button"
                            aria-label="Sort"
                            onClick={() => handleSort(colKey)}
                        >
                            <b className="sort-button-arrow">
                                {sortDir ? "🡓" : "🡑"}
                            </b>
                        </button>
                    </>
                )}
                &nbsp;
            </div>
        </th>
    );
}

export default TableHeaderElement;
