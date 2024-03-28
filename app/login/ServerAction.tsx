'use server'
import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ServerAction = async (formData: FormData) => {
    
    let message:string ='';

    try {
        let data: any 
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "identifier": formData.get("username"),
            "password": formData.get("password")
        });

        const requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };


        const res = await fetch("https://dashboard.myhuahin.co/api/auth/local", requestOptions)
        const res_data = await res.json();


        // console.log(res_data);
        data = res_data;
        // console.log(res.status)
        if (res.status == 200) {
            const token = cookies().set('token',res_data.jwt)
            // console.log(token)
        }else {
            // console.log(res_data)
            message = res_data?.error?.message;
            throw new Error(res_data?.error?.message);
        }


        return {message: 'Sucesfully Login',status:200};
    }catch (e) {
        // console.log(" Server : " + message)
        // console.log(e);
        return {message,status:500};
    }
}

export default ServerAction
