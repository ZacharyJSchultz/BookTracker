import React, { ReactNode } from 'react'

interface Props {
    handleSort: (sortKey: string) => void,
    sortDir: boolean | null,
    colKey: string,
    children: ReactNode,
}

// Note: Naming a prop "key" gives it special React properties, meaning that the value doesn't ACTUALLY get passed... 
// it's only used by the DOM, so it'll be undefined if you actually try to use it
function TableHeaderElement({handleSort, sortDir, colKey, children}: Props) {
  let noWrapSpaces = String(children).replace(" ", "\u00A0");  // Replaces regular spaces with ones that prevent wrapping, to make the front-end look better

  return (
    <th scope="col" className="text-center">
        <div style={{
          display: "flex", 
          alignItems: "center",
          minWidth: "75px",
          maxWidth: "250px",
          overflowWrap: "anywhere",
          wordWrap: "break-word",
          margin: "0 auto"
        }}>
          &nbsp;
          <span className="align-middle" style={{flex: "1 1 auto", whiteSpace: "normal"}}>{noWrapSpaces}</span>
          &ensp;
          <button type="button" className="btn btn-sm btn-secondary float-end" aria-label="Sort" onClick={() => handleSort(colKey)} style={{height: "25px", display: "flex", alignItems: "center"}}>
              <b>{sortDir ? "↓" : "↑"}</b>
          </button>
          &nbsp;
        </div>
    </th>
  )
}

export default TableHeaderElement;