import React from 'react'

const GET = async () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzEyMDMxNDg0LCJleHAiOjE3MTQ2MjM0ODR9.Ls-5D2o0XbzPA4SeFZkVp6pkfWk7KwJI4lPW8Mq9oLQ");

    const res = await fetch("https://dashboard.myhuahin.co/api/blogs/15?populate=Image_cover")
    const parsedData = await res.json()

    return Response.json(parsedData);
}

export {GET}