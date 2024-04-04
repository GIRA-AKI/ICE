'use server'

import { cookies } from 'next/headers';
import React from 'react'

const kEYTOKEN = process.env.KEYTOKEN

const upload_image = (imageRef:any , scred_id:number  ) => {

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

  fetch("https://dashboard.myhuahin.co/api/upload", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}



const Func_add_data = async (formData:FormData) => {
    const imageRef:any = formData.get("image")
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
          "Status": false,
          "Date_publish": null
        }
      });

    
  const requestOptions:any = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  let res:any;
  await fetch("https://dashboard.myhuahin.co/api/blogs", requestOptions)
  .then((response) => { res_status = response.status 
  res = response})
  .then((result) => console.log(result))
  .catch((error) => console.error(error));




  console.log("Here is the result of trying : " , res)
  if(res_status == 200){


    if(formData.get('image') != null){
      console.log('tess')
    } 
  }
  return res_status
}

export default Func_add_data