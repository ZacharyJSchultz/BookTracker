import React, { ReactNode } from 'react'

interface Props {
    id: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    children: ReactNode;
}

function Checkbox({ id, handleChange, children }: Props) {
  return (
    <div className="form-check">
        <input type="checkbox" className="form-check-input" id={id} onChange={handleChange}></input>
        <label htmlFor={id} className="form-check-label" >{children}</label>
    </div>
  )
}

export default Checkbox;