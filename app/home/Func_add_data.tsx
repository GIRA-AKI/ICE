'use server'

import { cookies } from 'next/headers';
import React from 'react'

const Func_add_data = async (formData:FormData) => {
    const token = cookies().get('token')
    let res_status:any = ""
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token?.value);

    const raw = JSON.stringify({
        "data": {
          "Title": formData.get('Title'),
          "Description": formData.get('Description'),
          "Excerpt": formData.get('Excerpt'),
          "Status": formData.get('Status'),
          "Date_publish": null
        }
      });
  

  const requestOptions:any = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  await fetch("https://dashboard.myhuahin.co/api/blogs", requestOptions)
    .then((response) => { res_status = response.status})
    .then((result) => console.log())
    .catch((error) => console.error(error));

   return res_status
}

export default Func_add_data
