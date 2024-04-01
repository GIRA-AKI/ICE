'use client'
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Func_add_data from './Fucntion/Func_add_data'
import { redirect, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import Loading from './components/Loading'
import navbar from './components/Navbar'

const page = () => {
  const router = useRouter();
  const [data, setData] = useState<any>([])
  const [_id, set_id] = useState<any>({})
  const [status_fetch, setstatus_fetch] = useState<boolean>(false)
  const [att, setAtt] = useState<any>([])
  const [secret_id, set_setcret_id] = useState<any>()
  const allField = useRef<HTMLFormElement>(null)

  const [Title, set_Title] = useState("")
  const [Description, set_Description] = useState("")
  const [Excerpt, set_Excerpt] = useState("")
  const [Date_publish, set_Date_publish] = useState<any>("")
  const [status, set_status] = useState<string>("")
  const [new_b, set_new_b] = useState<string>("")
  const [isToken, set_isToken] = useState<Boolean>(false)

  const [dataLoad, SetdataLoad] = useState<Boolean>(false)
  const listData = async () => {

    const token = Cookies.get('token')
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    await fetch('https://dashboard.myhuahin.co/api/blogs/', requestOptions).then(res => res.json()).then((d) => {
      if (d.data == null) {
        setData([])
      } else {
        setData(d.data)
      }
      SetdataLoad(true)
    })

  }

  /**
  |--------------------------------------------------
  | check token
  |--------------------------------------------------
  */
  useEffect(() => {

    const checkToken = async () => {
      const res = Cookies.get('token');
      if (res) {
        await set_isToken(true)
      }
      else {
        await set_isToken(false)
      }
    }
    checkToken()
    listData()

  }, [router, Cookies.get('token')])



  /**
  |--------------------------------------------------
  |   detail function
  |--------------------------------------------------
  */
  const moreMore = async (ID: any) => {
    set_setcret_id(ID)
    setstatus_fetch(true);
    const token = Cookies.get('token')


    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    // console.log(ID)
    // console.log("Bearer " + token)

    const rem = await fetch(`https://dashboard.myhuahin.co/api/blogs/${ID}`, requestOptions)
    const ram = await rem.json()
    set_id(ram?.data)

    setAtt(ram?.data?.attributes)

    set_Title(ram?.data?.attributes.Title)
    set_Description(ram?.data?.attributes.Description)
    set_Excerpt(ram?.data?.attributes.Excerpt)
    set_status(ram?.data?.attributes.Status)
    set_Date_publish(ram?.data?.attributes.Date_publish)
    // // console.log(Date_publish)
    // console.log("---------->" + status)
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
  const func_delete = async (ID: any) => {
    setstatus_fetch(true);

    const token = Cookies.get('token')


    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    const raw = "";

    const requestOptions: any = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://dashboard.myhuahin.co/api/blogs/" + ID, requestOptions)
      .then((response) => response.text())
      // .then((result) => console.log(result))
      .catch((error) => console.error(error));

    setstatus_fetch(false);

    setTimeout(() => {
      listData()
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data was deleted",
        showConfirmButton: true
        // timer: 1500
      });
    }, 100)
  }


  {
    /**
    |--------------------------------------------------
    | Edit function
    |--------------------------------------------------
    */
  }
  const func_edit = (formData: FormData) => {

    if (formData.get('Status')?.toString() != "true" && formData.get('Status')?.toString() != "false") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Data incorrected",
        showConfirmButton: true
        // timer: 1500
      });
      return
    }

    const token = Cookies.get('token')
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);


    const today = new Date()
    const date = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, '0')}`
    const hours = `${today.getHours().toString().padStart(2, "0")}:${today.getMinutes().toString().padStart(2, "0")}:00.000Z`

    // console.log(hours)
    let raw = JSON.stringify({})
    if (formData.get('Status')?.toString() != new_b?.toString()) {
      raw = JSON.stringify({
        "data": {
          "Title": Title,
          "Description": Description,
          "Excerpt": Excerpt,
          "Status": status,
          "Date_publish": (status === "true") ? `${date}T${hours}` : null
        }
      });

    }
    else {
      raw = JSON.stringify({
        "data": {
          "Title": Title,
          "Description": Description,
          "Excerpt": Excerpt,
        }
      });
    }


    const requestOptions: any = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://dashboard.myhuahin.co/api/blogs/" + secret_id, requestOptions)
      .then((response) => response.text())
      // .then((result) => console.log(result))
      .catch((error) => console.error(error));

    setTimeout(() => {
      listData()
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data was updated",
        showConfirmButton: true
        // timer: 1500
      });
    }, 500)
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

    if (dateString == null) return "- -"
    return `${formattedDate} ${formattedTime}`;
  }

  useEffect(() => {
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
  }, [])
  return (
    <>
      <Navbar />
      <div className="container p-5">

        <div className="  ">
          {
            (isToken) && (
              <button className='btn-success btn float-end my-2' data-bs-toggle="modal" data-bs-target="#staticBackdrop_add"  >Add</button>
            )}
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

            {data == null && (
              <tr>
                <th colSpan={7} className='p-5 text-2xl'>
                  Data not founded !
                </th>
              </tr>
            )}

            {data.length > 0 && dataLoad == true && (
              data.map((e: any, index: number) => {

                const att = e?.attributes
                return (
                  <tr key={index} >
                    <th scope="row">{index + 1}</th>
                    <td>{att?.Title}</td>
                    <td>{att?.Description}</td>
                    <td>{att?.Excerpt}</td>
                    <td >
                      {(att?.Status.toString() == "true") && (<div className="opacity-90 bg-green-500 mx-auto rounded-full w-4 h-4"></div>)}
                      {(att?.Status.toString() == "false") && (<div className="opacity-50  bg-slate-500 mx-auto rounded-full  w-4 h-4"></div>)}
                    </td>
                    <td>{formatDate(att?.Date_publish)}</td>
                    <td className='w-[300px]' >
                      <button type="button" onClick={() => { moreMore(e.id) }} data-bs-toggle="modal" data-bs-target="#staticBackdrop" className='btn btn-info m-2'>Info</button>

                      {
                        (isToken) && (
                          <button type="button" onClick={() => { moreMore(e.id) }} data-bs-toggle="modal" data-bs-target="#staticBackdrop_edit" className='btn btn-warning m-2'>Edit</button>
                        )
                      }

                      {
                        (isToken) && (
                          <button type="button" onClick={() => { moreMore(e.id) }} data-bs-toggle="modal" data-bs-target="#staticBackdrop_del" className='btn btn-danger m-2'>Delete</button>
                        )
                      }
                    </td>
                  </tr>

                )


              })
            )}

            {dataLoad == false && (
              <tr>
                <td colSpan={7}>Loading...</td>
              </tr>
            )}

            {data.length == 0 && dataLoad == true && (
              <tr>
                <td colSpan={7}>Not founded data</td>
              </tr>
            )}

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
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Title  </div>         <div className='col-9 fw-normal'>  {att.Title} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'>  {att.Description} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Excerpt  </div>       <div className='col-9 fw-normal'>  {att.Excerpt} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Status  </div>       <div className='col-9 fw-normal'>
                    {(status.toString() == "true") ? "Published" : "Unpublished"}
                  </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Date_publish  </div>   <div className='col-9 fw-normal'>  {att.Date_publish} </div>
                  <hr className='my-3' />
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
          <form className="modal-content" action={(formData: FormData) => { func_edit(formData) }} >
            <div className="modal-header bg-warning  ">
              <h5 className="modal-title" id="staticBackdropLabel">Edit </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className='row' id="add_data" >
                <div className='col-3 fw-bold'> ID  </div>            <div className='col-9 fw-normal'> <input type="text" name="ID" placeholder={_id.id} id="" className=" form-control " disabled /> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Title  </div>   <div className='col-9 fw-normal'> <input type="text" name="Title" value={Title} onChange={(e) => set_Title(e.target.value)} id="" className="form-control" /> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'> <textarea name="Description" value={Description} onChange={(e) => set_Description(e.target.value)} id="" className='form-control'></textarea> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Excerpt  </div>         <div className='col-9 fw-normal'> <input type="text" value={Excerpt} onChange={(e) => set_Excerpt(e.target.value)} name="Excerpt" id="" className="form-control" /> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Status  </div>       <div className='col-9 fw-normal'> <select name="Status" id="" className="form-control" value={status} onChange={(e) => set_status(e.target.value)}> <option value="false" >Unpublished</option> <option value="true">Published</option>  </select> </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-warning" data-bs-dismiss="modal">Update</button>
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
          <form className="modal-content" ref={allField} action={async (formData: FormData) => {

            let s = await Func_add_data(formData)
            if (s == '200') {
              setTimeout(() => {
                listData()
                allField.current?.reset()

                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Data was saved",
                  showConfirmButton: true
                  // timer: 1500
                });


              }, 100)

            }
            else {
              // when failed to add stuff
              // console.log('error')
            }

          }} >
            <div className="modal-header bg-success text-white ">
              <h5 className="modal-title" id="staticBackdropLabel">Add data</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className='row' id="add_data" >
                <div className='col-3 fw-bold'> ID  </div>            <div className='col-9 fw-normal'> <input type="text" name="ID" id="" placeholder='auto' className=" form-control " disabled /> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Title  </div>   <div className='col-9 fw-normal'> <input type="text" name="Title" id="" className="form-control" /> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'> <textarea name="Description" id="" className='form-control' ></textarea> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Excerpt  </div>         <div className='col-9 fw-normal'> <input type="text" name="Excerpt" id="" className="form-control" /> </div>
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
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Title  </div>         <div className='col-9 fw-normal'>  {att.Title} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'>  {att.Description} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Date_publish  </div>   <div className='col-9 fw-normal'>  {att.Date_publish} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Excerpt  </div>       <div className='col-9 fw-normal'>  {att.Excerpt} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >createdAt  </div>     <div className='col-9 fw-normal'>  {att.createdAt} </div>
                </div>
              )
              }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-danger" onClick={() => { func_delete(secret_id) }} data-bs-dismiss="modal">Delete</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default page