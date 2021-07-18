import React from "react"
import style from "./Button.module.css"

function Button({ href, onClick, children }) {
  console.log(href)
  // If href render anchor, else div
  const inner = (href !== undefined)
    ? <a className={style.inner} href={href}>{children}</a>
    : <div className={style.inner} onClick={onClick}>{children}</div>

  return (
    <div
      className={style.button}
    >
      {inner}
    </div>
  )
}

export default Button