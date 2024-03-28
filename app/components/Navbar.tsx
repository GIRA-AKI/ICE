import { cookies } from 'next/headers'
import React from 'react'
import Func_logout from './Func_logout'
import { redirect, useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const navbar = () => {
    const { push } = useRouter();

  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container-fluid justify-content-around justify-center items-center ">

                <a className="navbar-brand" href="#">TES</a>

                <div className="collapse navbar-collapse float-end" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                        </li>
                    </ul>
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                
                <div onClick={async() => { const res = await Func_logout('token')
                    if(res == "out"){

                        push("/login")
                    }

            }} className='btn btn-warning'>Log Out</div>
            </div>

        </nav>
    </div>
  )
}

export default navbar
