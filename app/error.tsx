'use client'
import { createBootstrapComponent } from "react-bootstrap/esm/ThemeProvider";
 
const error = ({error , reset} : {error: Error ; reset: ()=>void}) => {
  return (
    <main className="flex flex-col items-center h-screen justify-center content-center ">
      <div className="my-5 text-xl h2 ">There was a problem</div>
      <div className="my-5"><span className="h5">the reason is :</span><span className="text-lg"> {error.message || 'Something went wrong'}</span></div>
      <div className="my-5"> <button onClick={reset} className="btn btn-primary">Try again</button></div>
    </main>
  )
  return <div>error</div>
}

export default error