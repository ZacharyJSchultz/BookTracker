import React, { ReactNode } from 'react'

interface Props {
    id: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    checked: boolean,
    children: ReactNode,
}

function Radio({ id, handleChange, checked, children }: Props) {
  return (
    <div className="form-check">
        <input type="radio" className="form-check-input" name="main-genres" id={id} onChange={handleChange} checked={checked}></input>
        <label htmlFor={id} className="form-check-label" >{children}</label>
    </div>
  )
}

export default Radio;