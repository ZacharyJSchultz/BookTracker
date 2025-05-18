import React, { ReactNode } from 'react'
import { FormattedDataRow, FormattedDataRowKey } from './ViewDB'

interface Props {
    handleSort: (sortProp: FormattedDataRowKey) => void,
    sortDir: number,
    key: keyof FormattedDataRow,
    children: ReactNode,
}

function TableElement({handleSort, sortDir, key, children}: Props) {
  return (
    <th scope="col" className="text-center" style={{whiteSpace:"nowrap"}}>
        <div style={{display: "inline-flex", alignItems: "center"}}>
          &nbsp;
          <span className="align-middle">{children}</span>
          &ensp;
          <button type="button" className="btn btn-sm btn-secondary float-end" aria-label="Sort" onClick={() => handleSort(key)} style={{height: "25px", display: "flex", alignItems: "center"}}>
              <b>{sortDir === 1 ? "↓" : "↑"}</b>
          </button>
          &nbsp;
        </div>
    </th>
  )
}

export default TableElement;