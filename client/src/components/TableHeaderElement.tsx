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
  return (
    <th scope="col" className="text-center" style={{whiteSpace:"nowrap"}}>
        <div style={{display: "inline-flex", alignItems: "center"}}>
          &nbsp;
          <span className="align-middle">{children}</span>
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