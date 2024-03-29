'use server'
import { cookies } from 'next/headers'
import React from 'react'

const Func_logout = async (data:any) => {
    cookies().delete(data)
    return "out"
}

export default Func_logout
