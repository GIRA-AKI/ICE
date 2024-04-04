'use client'
import { useEffect, useState } from 'react'
import React from 'react'
import Cookies from 'js-cookie'

const page = () => {

    const [js , set_js ] = useState<any>({})

    const listData = () =>{
        const token = Cookies.get("token")
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token);

        const requestOptions:any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
        };

        fetch("https://dashboard.myhuahin.co/api/blogs?populate=*", requestOptions)
        .then((response) => response.json())
        .then((result) =>  console.log(result.data))
        .catch((error) => console.error(error));
    }

    useEffect(() =>{
        listData()
    },[])

  return (
    <div>
    </div>
  )
}

export default page