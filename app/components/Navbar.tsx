import React, { useEffect, useState } from 'react'
import Func_logout from '../Fucntion/Func_logout'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import Router from "next/router";
const navbar = () => {
    const router = useRouter();
    const [isToken , set_isToken] = useState<boolean>(false)
    const [btn , set_btn] = useState<boolean>(false)
    const [active, set_active] =useState<boolean>(false)

    useEffect(() => {
        const res = Cookies.get("token")
        if(res){
            set_isToken(true)
        }
        else{
            set_isToken(false)
        }
        set_btn(true)
    })
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


                {  isToken && btn && (
                    <button onClick={async() => { const res = await Func_logout('token')
                        set_active(true)
                        if(res == "out"){
                            router.replace("/")
                        }
                    }} className='btn btn-warning' disabled={active}>Log Out</button>

                )}

                {  !isToken && btn && (
                    <Link href="/login" className='btn btn-primary' >Login</Link>
                )}
            </div>

        </nav>
    </div>
  )
}

export default navbar
