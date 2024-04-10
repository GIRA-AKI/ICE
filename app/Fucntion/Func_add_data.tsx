'use server'

import { cookies } from 'next/headers';
import React from 'react'

const kEYTOKEN = process.env.KEYTOKEN

const upload_image = async (imageRef:any , scred_id:number  ) => {

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer "+kEYTOKEN);

  const fileBlob = new Blob([imageRef], { type: imageRef.type });
  const formdata = new FormData();
  formdata.append("files", fileBlob,imageRef.name);
  formdata.append("refId", scred_id.toString());
  formdata.append("ref", "api::blogs1.blogs1");
  formdata.append("field", "Image_cover");

  const requestOptions:object = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow"
  };

  const result = await fetch("https://dashboard.myhuahin.co/api/upload", requestOptions)

  return result.status

}



const Func_add_data = async (formData:FormData) => {
    const imageRef:any = formData.get("image")
    const token = cookies().get('token')
    let res_status:any = ""
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token?.value);

    const today = new Date()
    const date = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, '0')}`
    const hours = `${today.getHours().toString().padStart(2, "0")}:${today.getMinutes().toString().padStart(2, "0")}:00.000Z`

    const raw = JSON.stringify({
        "data": {
          "Title": formData.get('Title'),
          "Description": formData.get('Description'),
          "Excerpt": formData.get('Excerpt'),
          "Status": formData.get('Status'),
          "Date_publish": (formData.get('Status') === "true") ? `${date}T${hours}` : null
        }
      });

    
  const requestOptions:any = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const result  = await fetch("https://dashboard.myhuahin.co/api/blogs", requestOptions)
  const img = formData.get("image")

  if(result.status == 200){
    const res = await result.json()
    if(formData.get("image") != null)
    {
      return upload_image(img,res.data.id)
    }
    
  
  }
  return result.status 
}

export default Func_add_data