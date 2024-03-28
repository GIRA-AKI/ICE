'use client'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { redirect } from 'next/navigation';
import ServerAction from './ServerAction';
import { useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';


// const Get_token =  () => {
//     const cookieStore = cookies()
//     const theme = cookieStore.get('token')
//     console.log(theme)
// }

interface Message {
    message : string
}

const page = () => {
    // const [status ,setStatus] = useState<any>('')
    const [state ,setState] = useState<any>({})
    const route = useRouter()
    const cookies = useCookies();
    // console.log(cookies.get('token'))

    // useEffect(()=>{
    //     console.log("fd"+status)
    // },[status])

  return (
    <div className='w-[350px] mx-auto my-5'>

        <form action={ async (formData:FormData) => {
            // wait to get data from ServerAction 
            const data_this = await ServerAction(formData);

            // set state of value
            setState(data_this);
            if(data_this.status == 200) {
                setTimeout(()=> {route.push('/home')},2000)
            }
        }} >
            <div className="form-floating mb-3">
            <input
                type="text"
                className="form-control"
                id="input1"
                placeholder="name@example.com"
                name='username'
            />
            <label htmlFor="input1">Username</label>
            </div>

            <div className="form-floating mb-3">
            <input
                type="text"
                className="form-control"
                id="input1"
                placeholder="name@example.com"
                name='password'
            />
            <label htmlFor="input1">Password</label>
            </div>
            <p className="mb-0">Message : {state?.message}</p>
            <button type="submit" className='btn btn-primary float-end'>Login</button>
        </form>

    </div>
  )
}

export default page