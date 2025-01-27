import React, { ReactNode } from 'react'
import { DataRow, DataRowKey } from './ViewDB';

interface Props {
    handleSort: (sortProp: DataRowKey) => void,
    sortDir: number,
    key: keyof DataRow,
    children: ReactNode,
}

function TableElement({handleSort, sortDir, key, children}: Props) {
  return (
    <th scope="col" className="text-center">
        <span className="align-middle">{children}</span>
        <button type="button" className="btn btn-sm btn-secondary float-end" aria-label="Sort" onClick={() => handleSort(key)}>
            <b>{sortDir === 1 ? "↓" : "↑"}</b>
        </button>
    </th>
  )
}

export default TableElement;