import React from 'react'

export default function Navbar(props) {
  return (
    <div>
      <navBar className="navbar navbar-expand-lg bg-danger">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active text-white fs-4" aria-current="page" href="/">Transactions Statistics</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active text-white fs-4" aria-current="page" href="/products">Transactions</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active text-white fs-4" aria-current="page" href="/about">Transactions Bar Chart</a>
              </li>
            </ul>

          </div>
        </div>

      </navBar>
    </div>
  )
}
