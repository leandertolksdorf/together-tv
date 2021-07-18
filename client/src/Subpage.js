import React from "react"
import Button from "./components/Button"
// import { Link } from "wouter"
import style from "./Subpage.module.css"

function Subpage({ children }) {
  return (
    <div
      className={style.wrapper}
      style={{ animation: "fadeIn .5s ease-in-out" }}
    >
      <Button onClick={() => window.history.back()}>
        🍿&nbsp;Go back
      </Button>
      {children}
    </div>
  )
}

export default Subpage