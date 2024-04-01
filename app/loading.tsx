import { Box, CircularProgress } from '@mui/material'
import { divider, image } from '@nextui-org/react'
import React from 'react'
import Image from 'next/image'

const loading = () => {

// return (<Image
//           src="/torii.jpg"
//           width={1920}
//           height={1080}
//           alt="Picture of the author"
//         />)

return (<div className='mx-auto w-fit'> Loading ....</div>)

}

export default loading
