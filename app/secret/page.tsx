'use server'

import { cookies } from 'next/headers'
import React from 'react'
const page = async () => {

    const tem = () => {
        cookies().set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzExMzQwMTU0LCJleHAiOjE3MTM5MzIxNTR9.kMaauYeu_cfOXDcUkrlfPNde_4AtJU9U822MCtP-u-A')
    }

}

export default page
