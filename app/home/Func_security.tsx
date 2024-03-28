'use server'
import { cookies } from 'next/headers'

const Func_security = async () => {
    if(!cookies().has('token')){
        return "ban"
    }
    return "legal"
}

export default Func_security
