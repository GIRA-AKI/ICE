'use client'
import React from 'react'

const page = () => {
    const saaa = () =>{
        throw new Error("This error from throw error");
    }
    return(
        <button onClick={()=>saaa}>Click to trigger error</button>
    )
    
}

export default page
