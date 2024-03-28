'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { useCookies } from 'next-client-cookies'
import Func_add_data from './Func_add_data'
import Func_security from './Func_security'
import { redirect, useRouter } from 'next/navigation'





const page = () => {
  const { push } = useRouter();
  const [data, setData] = useState<any>([{}])
  const [_id, set_id] = useState<any>({})
  const [status_fetch, setstatus_fetch] = useState<boolean>(false)
  const cookies = useCookies();
  const [att , setAtt] = useState<any>([{}])
  const [secret_id, set_setcret_id ] = useState<any>()
  const allField = useRef<HTMLFormElement>(null)

  const [Title, set_Title] = useState("")
  const [Description, set_Description] = useState("")
  const [Excerpt, set_Excerpt] = useState("")
  const [Date_publish, set_Date_publish] = useState<any>("")
  const [status, set_status] = useState<string>("")
  const [new_b ,set_new_b] = useState<string>("")


  const listData = async () => {
    await fetch('https://dashboard.myhuahin.co/api/blogs/').then(res => res.json()).then((d) => {
      setData(d.data)
    })

  }
/**
|--------------------------------------------------
|   detail function
|--------------------------------------------------
*/
  const moreMore = async (ID: any) => {
    set_setcret_id(ID)
    setstatus_fetch(true);
    const token = cookies.get('token')
 

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    console.log(ID)
    console.log("Bearer " + token)

    const rem = await fetch(`https://dashboard.myhuahin.co/api/blogs/${ID}`, requestOptions)
    const ram = await rem.json()
    set_id(ram?.data)

    setAtt(ram?.data?.attributes)

    set_Title(ram?.data?.attributes.Title)
    set_Description(ram?.data?.attributes.Description)
    set_Excerpt(ram?.data?.attributes.Excerpt)
    set_status(ram?.data?.attributes.Status)
    set_Date_publish(ram?.data?.attributes.Date_publish)
    // console.log(Date_publish)
    console.log("---------->" + status)
    set_new_b(ram?.data?.attributes.Status)
    setstatus_fetch(false);
  }


  {
    /**
    |--------------------------------------------------
    | Delete function
    |--------------------------------------------------
    */
  }
  const func_delete = async(ID:any) =>{
    setstatus_fetch(true);

    const token = cookies.get('token')

    
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    const raw = "";

    const requestOptions:any = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://dashboard.myhuahin.co/api/blogs/"+ ID, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    setstatus_fetch(false);

    setTimeout(()=> {
      listData()
    },100)
  } 


  {
    /**
    |--------------------------------------------------
    | Edit function
    |--------------------------------------------------
    */
  }
  const func_edit = (formData:FormData) => {
    
    const token = cookies.get('token')
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);


    const today = new Date()
    const date = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,"0")}-${today.getDate().toString().padStart(2 ,'0')}`
    const hours = `${today.getHours().toString().padStart(2,"0")}:${today.getMinutes().toString().padStart(2,"0")}:00.000Z`


    console.log(hours)
    let raw = JSON.stringify({})           
    if(formData.get('Status')?.toString() != new_b?.toString()){
      raw = JSON.stringify({
        "data": {
          "Title": Title,
          "Description": Description ,
          "Excerpt": Excerpt,
          "Status": status,
          "Date_publish" : (status === "true") ? `${date}T${hours}` : null
        }
      });

    }
    else{
      raw = JSON.stringify({
        "data": {
          "Title": Title,
          "Description": Description ,
          "Excerpt": Excerpt,
        }
      });
    }


    const requestOptions:any = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://dashboard.myhuahin.co/api/blogs/"+ secret_id, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));


      setTimeout(()=> {

        listData()
        
      },500)
  }

  {
    /**
    |--------------------------------------------------
    | function for format time
    |--------------------------------------------------
    */
  }
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const formattedDate = `${date.getFullYear()} - ${(date.getMonth() + 1).toString().padStart(2, '0')} - ${date.getDate().toString().padStart(2, '0')}`;
    
    const formattedTime = `${(date.getHours() - 7).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    if(dateString == null) return "- -"
    return `${formattedDate} ${formattedTime}`;
  }

  useEffect(() => {

    const res = Func_security()

    const tem = async () => {
      if(await res == "ban"){
        push("/login")
      }
    }
    tem()


    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
    listData()
  }, [])

  return (
    <>
      <Navbar />
      <div className="container p-5">

        <div className="  ">
          <button className='btn-success btn float-end my-2' data-bs-toggle="modal" data-bs-target="#staticBackdrop_add"  >Add</button>
        </div>

        <table className="table  text-center">
          <thead className='table-dark'>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Excerpt</th>
              <th scope="col">Status</th>
              <th scope="col">Date_publish</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((e: any, index: number) => {
                const att = e?.attributes
                return (
                  <tr key={index}>
                    <th scope="row">{e.id}</th>
                    <td>{att?.Title}</td>
                    <td>{att?.Description}</td>
                    <td>{att?.Excerpt}</td>
                    <td>{att?.Status.toString()}</td>
                    <td>{formatDate(att?.Date_publish)}</td>
                    <td className='w-[300px]' >
                      <button type="button" onClick={() => { moreMore(e.id) }} data-bs-toggle="modal" data-bs-target="#staticBackdrop" className='btn btn-info m-2'>Info</button>
                      <button type="button" onClick={() => { moreMore(e.id) }} data-bs-toggle="modal" data-bs-target="#staticBackdrop_edit" className='btn btn-warning m-2'>Edit</button>
                      <button type="button" onClick={() => { moreMore(e.id) }} data-bs-toggle="modal" data-bs-target="#staticBackdrop_del" className='btn btn-danger m-2'>Delete</button>
                    </td>
                  </tr>)
              })
            }
          </tbody>
        </table>


      </div>


      {
        /**
        |--------------------------------------------------
        | Modal for detail 
        |--------------------------------------------------
        */
      }
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content"> 
            <div className="modal-header bg-info ">
              <h5 className="modal-title" id="staticBackdropLabel">Detail</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {status_fetch == false && ( 
              <div className='row'>
                <div className='col-3 fw-bold'> ID  </div>            <div className='col-9 fw-normal'>  {_id.id} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Title  </div>         <div className='col-9 fw-normal'>  {att.Title} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'>  {att.Description} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Excerpt  </div>       <div className='col-9 fw-normal'>  {att.Excerpt} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Status  </div>       <div className='col-9 fw-normal'>  {status.toString()} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Date_publish  </div>   <div className='col-9 fw-normal'>  {att.Date_publish} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >createdAt  </div>   <div className='col-9 fw-normal'>  {att.createdAt} </div>
              </div>
              )
              }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>



      {
        /**
        |--------------------------------------------------
        | Modal for Edit 
        |--------------------------------------------------
        */
      }
      <div className="modal fade" id="staticBackdrop_edit" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content"   action={(formData:FormData) => { func_edit(formData) }} > 
            <div className="modal-header bg-warning  ">
              <h5 className="modal-title" id="staticBackdropLabel">Edit </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className='row' id="add_data" >
                <div className='col-3 fw-bold'> ID  </div>            <div className='col-9 fw-normal'> <input type="text" name="ID" placeholder={_id.id} id=""  className=" form-control " disabled/> </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Title  </div>   <div className='col-9 fw-normal'> <input type="text" name="Title" value={Title}   onChange={(e) => set_Title(e.target.value)}  id="" className="form-control" /> </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'> <textarea name="Description" value={Description} onChange={(e) => set_Description(e.target.value)}  id="" className='form-control'></textarea> </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Excerpt  </div>         <div className='col-9 fw-normal'> <input type="text"  value={Excerpt} onChange={(e) => set_Excerpt(e.target.value)} name="Excerpt" id="" className="form-control" /> </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Status  </div>       <div className='col-9 fw-normal'> <select name="Status"  id="" className="form-control" value={status} onChange={(e) => set_status(e.target.value)}> <option value="false" >false</option> <option value="true">true</option>  </select> </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-warning"  data-bs-dismiss="modal">Update</button>
            </div>
          </form>
        </div>
      </div>



      {
        /**
        |--------------------------------------------------
        | Modal for add data 
        |--------------------------------------------------
        */
      }
      <div className="modal fade" id="staticBackdrop_add" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content"  ref={allField} action={async (formData:FormData) => {
                let s = await Func_add_data(formData) 
                if( s == '200'){
                  setTimeout(()=> {
                    listData()
                    allField.current?.reset()
                  },100)
                  
                }
                else{
                  // when failed to add stuff
                }
              
            }} > 
            <div className="modal-header bg-success text-white ">
              <h5 className="modal-title" id="staticBackdropLabel">Add data</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className='row' id="add_data" >
                <div className='col-3 fw-bold'> ID  </div>            <div className='col-9 fw-normal'> <input type="text" name="ID" id="" placeholder='auto' className=" form-control " disabled/> </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Title  </div>   <div className='col-9 fw-normal'> <input type="text" name="Title" id="" className="form-control" /> </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'> <textarea name="Description" id="" className='form-control'></textarea> </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Excerpt  </div>         <div className='col-9 fw-normal'> <input type="text" name="Excerpt" id="" className="form-control" /> </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Status  </div>       <div className='col-9 fw-normal'> <select name="Status" id="" className="form-control"> <option value="false" defaultChecked>false</option> <option value="true">true</option>  </select> </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-success" data-bs-dismiss="modal">Add</button>
            </div>
          </form>
        </div>
      </div>
      
      {
        /**
        |--------------------------------------------------
        |   Modal for delete
        |--------------------------------------------------
        */
      }
      <div className="modal fade" id="staticBackdrop_del" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content"> 
            <div className="modal-header bg-danger text-white ">
              <h5 className="modal-title" id="staticBackdropLabel">Delete !</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {status_fetch == false && ( 
              <div className='row'>
                <div className='col-3 fw-bold'> ID  </div>            <div className='col-9 fw-normal'>  {_id.id} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Title  </div>         <div className='col-9 fw-normal'>  {att.Title} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'>  {att.Description} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Date_publish  </div>   <div className='col-9 fw-normal'>  {att.Date_publish} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >Excerpt  </div>       <div className='col-9 fw-normal'>  {att.Excerpt} </div>
                <hr className='my-3'/>
                <div className='col-3 fw-bold' >createdAt  </div>     <div className='col-9 fw-normal'>  {att.createdAt} </div>
              </div>
              )
              }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-danger" onClick={() => { func_delete(secret_id)}} data-bs-dismiss="modal">Delete</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default page
