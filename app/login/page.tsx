'use client'
import ServerAction from './ServerAction';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertTitle, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';

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

  return (
    <>
        <div className='pl-[100px] py-[100px] absolute'>
            <span className='bg-slate-300 p-1 rounded'>username  </span><p>iceiiiii1998@gmail.com</p>
            <span className='bg-slate-300 p-1 rounded'> password  </span><p>!Apong64150123.</p>
        </div>

        <div className='w-full absolute top-0'>

            { (state.status == 500) && (
            <Alert severity="warning" className='w-full'>
                {state.message}
                
            </Alert>) 
            
            }
               
            { (state.status == 200) && (
            <Alert severity="success" className='w-full'>
                {state.message}
            </Alert>) }

        </div>
        <div className='w-[350px] mx-auto my-[115px]'>

            <form action={ async (formData:FormData) => {
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
                    <button type="submit" className='btn btn-primary  float-end' disabled={active} onClick={()=>setTimeout(()=>set_active(true),1)}> Login</button>
                </div>
            </form>

        </div>
    </>

  )
}

export default page