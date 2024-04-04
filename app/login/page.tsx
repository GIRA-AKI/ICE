'use client'
import ServerAction from './ServerAction';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertTitle, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import Swal from 'sweetalert2';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

// const Get_token =  () => {
//     const cookieStore = cookies()
//     const theme = cookieStore.get('token')
//     console.log(theme)
// }

interface Message {
    message : string
}

const page = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    // const [status ,setStatus] = useState<any>('')
    const [state ,setState] = useState<any>({})
    const route = useRouter()
    const [active , set_active] = useState<boolean>(false)
    // console.log(cookies.get('token'))

    // useEffect(()=>{
    //     console.log("fd"+status)
    // },[status])

  return (
    <>
    
        <div className='w-full absolute top-0'>

            { (state.status == 500) && (
            <Alert severity="warning" className='w-full'>
                {state.message}
            </Alert>) }

            { (state.status == 200) && (
            <Alert severity="success" className='w-full'>
                {state.message}
            </Alert>) }

        </div>
        <div className='w-[350px] mx-auto my-5'>

            <form action={ async (formData:FormData) => {
                set_active(true)
                // wait to get data from ServerAction
                const data_this = await ServerAction(formData);

                // set state of value
                setState(data_this);
                if(data_this.status == 200) {
                    setTimeout(()=> {route.push('/')},2000)
                }
                else{
                    setTimeout(()=> {set_active(false)},1000)
                    
                }
            }} className='form-login'>
                <h2 className='text-center'>LOGIN</h2>
                <div>
                    <TextField
                        className="input-field "
                        name='username'
                        label='Username'
                        variant="outlined"
                        type="text"
                        />
                </div>

                <div >
                    <TextField
                    className="input-field"
                    name='password'
                    label='Password'
                    variant="outlined"
                    type={showPassword ? "text" : "password"} // <-- This is where the magic happens
                    InputProps={{ // <-- This is where the toggle button is added.
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {showPassword ? "o" :"0"}
                            </IconButton>
                        </InputAdornment>
                        )
                    }}
                    />
                </div>
                <div className="input-field">
                    <button type="submit" className='btn btn-primary  float-end' disabled={active}> Login</button>
                </div>
            </form>

        </div>
    </>

  )
}

export default page