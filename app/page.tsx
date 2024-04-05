'use client'
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Func_add_data from './Fucntion/Func_add_data'
import { redirect, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import TablePagination from '@mui/material/TablePagination';
import { Pagination, Stack } from '@mui/material'
import Image from 'next/image'
import { cookies } from 'next/headers'

import 'dotenv/config'
const KEYTOKEN = process.env.KEYTOKEN;




const page = () => {
  function getExtension(filename:any) {
    return filename.split('.').pop()
  }

  // for add modal 
  const [atitle , set_atitle] = useState<string>('')
  const [ades , set_ades] = useState<string>('')
  const [aexe , set_aexe] = useState<string>('')


  const router = useRouter();
  const [data, setData] = useState<any>([])
  const [_id, set_id] = useState<any>({})
  const [status_fetch, setstatus_fetch] = useState<boolean>(true)
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [stackNum, set_stackNum] = useState<any>(1)
  const [currentPage, set_currentPage] = useState<number>(1)
  const [selectedImage, setSelectedImage] = useState<any>('/blank.png')
  const [switch_image, set_switch_image] = useState<any>(false)
  const [handle_image , set_handle_image] = useState<string>('') 

  const allIndex = async () => {
    const token = Cookies.get('token')
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    await fetch('https://dashboard.myhuahin.co/api/blogs/?pagination[pageSize]=99999', requestOptions).then(res => res.json()).then((d) => {
      if (d.data != null) {
        set_stackNum((d.data.length / rowsPerPage))
      }
    })

  }

  const listData = async (page: number = 0) => {
    allIndex()

    const token = Cookies.get('token')
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    if (page != 0) {

      await fetch('https://dashboard.myhuahin.co/api/blogs/?pagination[pageSize]=' + rowsPerPage + '&populate=*' + '&pagination[page]=' + page, requestOptions).then(res => res.json()).then((d) => {
        if (d.data == null) {
          setData([])
        } else {
          setData(d.data)
          allIndex()
        }
        SetdataLoad(true)
      })

    }
    else {
      await fetch('https://dashboard.myhuahin.co/api/blogs/?pagination[pageSize]=' + rowsPerPage + '&populate=*', requestOptions).then(res => res.json()).then((d) => {
        if (d.data == null) {
          setData([])
        } else {
          setData(d.data)
          allIndex()
        }
        SetdataLoad(true)
      })

    }
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

    set_switch_image(false)

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const rem = await fetch(`https://dashboard.myhuahin.co/api/blogs/${ID}?populate=Image_cover`, requestOptions)
    const ram = await rem.json()
    set_id(ram?.data)

    setAtt(ram?.data?.attributes)

    set_Title(ram?.data?.attributes.Title)
    set_Description(ram?.data?.attributes.Description)
    set_Excerpt(ram?.data?.attributes.Excerpt)
    set_status(ram?.data?.attributes.Status)
    set_Date_publish(ram?.data?.attributes.Date_publish)

    // // console.log(ram?.data?.attributes.Image_cover)
    if(ram?.data?.attributes?.Image_cover?.data?.attributes?.url == null){
      await setSelectedImage("/blank.png")
    }
    else{
      await setSelectedImage("https://dashboard.myhuahin.co" + ram?.data?.attributes?.Image_cover?.data?.attributes?.url)
    }
    // // console.log("here it is : https://dashboard.myhuahin.co" + ram?.data?.attributes?.Image_cover?.data?.attributes?.formats?.thumbnail?.url)

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
      // // // .then((result) => console.log(result))
      .catch((error) => console.error(error));

    setstatus_fetch(false);

    setTimeout(() => {
      listData(currentPage)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data was deleted",
        showConfirmButton: true
        // timer: 1500
      });
    }, 100)
  }

  /**
  |--------------------------------------------------
  | image uploader 
  |--------------------------------------------------
  */
  const func_upload_image = async (imageRef: any, idRef: number | string) => {

    const token = Cookies.get('token')


    // const myHeaders = new Headers();
    // console.log("Here is "+KEYTOKEN)
    // myHeaders.append("Authorization", "Bearer "+{KEYTOKEN});
    const headers = {
      "Authorization": `Bearer ${KEYTOKEN}`
    }

    // // console.log(imageRef)

    const fileBlob = new Blob([imageRef], { type: imageRef.type });
    const formdata = new FormData();
    formdata.append("files", fileBlob, imageRef.name);
    formdata.append("refId", idRef.toString() );
    formdata.append("ref", "api::blogs1.blogs1");
    formdata.append("field", "Image_cover");

   

    const requestOptions:any = {
      method: "POST",
      headers,
      body: formdata,
      redirect: "follow"
    };
    
    // console.log(imageRef.name)
   await fetch("https://dashboard.myhuahin.co/api/upload", requestOptions)
    .then((response) => response.text())
    // .then((result) => console.log(result))
    .catch((error) => console.error(error));
  }


  { /**
    |--------------------------------------------------
    | Edit function
    |--------------------------------------------------
    */}
  const func_edit = (formData: FormData) => {

    // const arr = ['png,jpeg,jpg']
    const img:any = formData.get('image')
    if(img.name != ''){
      const imgEx = getExtension(img.name)
      if(imgEx != "png" && imgEx != "jpeg" && imgEx != "jpg"){
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Type image incorrect",
          showConfirmButton: true
          // timer: 1500
        });
        return
      }
    }

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

    // // // console.log(hours)
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

    // image uploader
    if (formData.get('image') != null) {
      func_upload_image(formData.get('image'), secret_id)
      // alert(formData.get('image'))
    }

    const requestOptions: any = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://dashboard.myhuahin.co/api/blogs/" + secret_id, requestOptions)
      .then((response) => response.text())
      // // // .then((result) => console.log(result))
      .catch((error) => console.error(error));

    setTimeout(() => {
      listData(currentPage)
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
  function formatDateEN(dateString: string) {
    const date = new Date(dateString);
    const formattedDate = `${date.getFullYear()} - ${(date.getMonth() + 1).toString().padStart(2, '0')} - ${date.getDate().toString().padStart(2, '0')}`;

    const formattedTime = `${(date.getHours() - 7).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    if (dateString == null) return "N/A"
    return `${formattedDate} ${formattedTime}`;
  }

  function formatDateTH(dateString: string) {
    const date = new Date(dateString);
    const formattedDate = `${date.getFullYear()} - ${(date.getMonth() + 1).toString().padStart(2, '0')} - ${date.getDate().toString().padStart(2, '0')}`;
    const formatted_Date = `${date.getDate().toString().padStart(2, "0")} - ${(date.getMonth() + 1).toString().padStart(2, "0")} - ${(date.getFullYear() + 543).toString()}`
    const formattedTime = `${(date.getHours() - 7).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    if (dateString == null) return "N/A"
    return `${formatted_Date}   ${formattedTime}`;
  }

  useEffect(() => {
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
  }, [])


  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    listData(value);
    set_currentPage(value)
  };

  const handleChangePage = async (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    await setPage(newPage);
  };

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // setRowsPerPage(parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    set_currentPage(1)
    // // console.log("currentPage page : ", currentPage)
    // setPage(0)
  };

  useEffect(() => {
    allIndex()
    listData(1)
    // // console.log(currentPage)
  }, [rowsPerPage])


  /**
  |--------------------------------------------------
  | preview image
  |--------------------------------------------------
  */
  const imageChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      set_switch_image(true)
      console.log("work here")
    }
  }

  const removeImage = () => {
    set_switch_image(false)
    moreMore(secret_id)
  }


  return (
    <>
      <Navbar />
      <div className="container p-5">

        <div className="  ">
          {
            (isToken) && (
              <button className='btn-success btn float-end my-2' data-bs-toggle="modal" data-bs-target="#staticBackdrop_add"  >Add</button>
            )}
          {
            (isToken) && (
              <button className='rounded bg-warning btn float-end my-2 mx-2' onClick={() => listData(currentPage)}>Re</button>
            )}
        </div>



        <table className="table  text-center">
          <thead className='table-dark'>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Excerpt</th>
              <th scope="col">Status</th>
              <th scope="col">Date publish</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody>

            {data == null && (
              <tr>
                <th colSpan={8} className='p-5 text-2xl'>
                  Data not founded !
                </th>
              </tr>
            )}

            {data.length > 0 && dataLoad == true && (
              data.map((e: any, index: number) => {
                const att = e?.attributes
                // // console.log("INDEX : " + att.Image_cover.data)
                return (
                  <tr key={index} >
                    <th scope="row">{(index + 1) + (currentPage * rowsPerPage) - rowsPerPage}</th>
                    <td>
                      {att.Image_cover.data == null &&
                        (<Image width={50} height={50} alt={"image ice"} src="/blank.png" className='border-none w-[100px] oneonone' />)}

                      {att.Image_cover.data != null &&
                        (<Image width={50} height={50} alt={"image ice"} className='border-none w-[100px] oneonone' src={"https://dashboard.myhuahin.co" + att?.Image_cover?.data?.attributes?.url} />)
                      }
                    </td>
                    <td>{att?.Title}</td>
                    <td>{att?.Description}</td>
                    <td>{att?.Excerpt}</td>
                    <td >
                      {(att?.Status.toString() == "true") && (<div className="opacity-90 bg-green-500 mx-auto rounded-full w-4 h-4"></div>)}
                      {(att?.Status.toString() == "false") && (<div className="opacity-50  bg-slate-500 mx-auto rounded-full  w-4 h-4"></div>)}
                    </td>
                    <td>{formatDateTH(att?.Date_publish)}</td>
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
                <td colSpan={8}>Loading...</td>
              </tr>
            )}

            {data.length == 0 && dataLoad == true && (
              <tr>
                <td colSpan={8}>Not founded data</td>
              </tr>
            )}

          </tbody>
        </table>


        {dataLoad && (
          <div className='flex w-fit mx-auto items-center'>
            <label htmlFor="" className='w-fit pb-1'>จำนวนข้อมูล</label>
            <TablePagination
              component="div"
              count={dataLoad ? data.length : 100}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage} className='w-fit  pt-0 top-0'
            />
            <Stack spacing={2} className='pb-1' >
              <Pagination count={Math.ceil(stackNum)} shape="rounded" page={currentPage} onChange={handleChange} />
            </Stack>
          </div>)}



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
                  <div className='col-3 fw-bold' >Date publish  </div>   <div className='col-9 fw-normal'>  {formatDateTH(att.Date_publish)} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >createdAt  </div>   <div className='col-9 fw-normal'>  {formatDateTH(att.createdAt)} </div>
                  <div className='col-12'>
                    {dataLoad && (
                      <Image width={200} height={200} alt={"image ice"} src={selectedImage} className='mx-auto oneonone m-5'/>
                    )}
                  </div>
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
                <div className='col-3 fw-bold' >Title  </div>   <div className='col-9 fw-normal'> <input type="text" name="Title" value={Title} onChange={(e) => set_Title(e.target.value)} id="" className="form-control" /> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'> <textarea name="Description" value={Description} onChange={(e) => set_Description(e.target.value)} id="" className='form-control' ></textarea> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Excerpt  </div>         <div className='col-9 fw-normal'> <input type="text" value={Excerpt} onChange={(e) => set_Excerpt(e.target.value)} name="Excerpt" id="" className="form-control" /> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Status  </div>       <div className='col-9 fw-normal'> <select name="Status" id="" className="form-control" value={status} onChange={(e) => set_status(e.target.value)} > <option value="false" >Unpublished</option> <option value="true">Published</option>  </select> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Image  </div>         <div className='col-9 fw-normal'> <input type="file" onChange={imageChange} name="image" id="" className="form-control"  accept=".jpg,.png,.jpeg" /> </div>
                <hr className='my-3' />

                <div className="col-12">
                  {dataLoad && switch_image && (
                    <Image width={200} height={200} alt={"image ice"} src={URL.createObjectURL(new Blob([selectedImage], { type: "application/*" }))} className='mx-auto oneonone m-5'/>
                  )}
                  {dataLoad && !switch_image && (
                    <Image width={200} height={200} alt={"image ice"} src={selectedImage} className='mx-auto oneonone m-5'/>
                  )}
                </div>




              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={removeImage}>Close</button>
              <button type="submit" className="btn btn-warning" data-bs-dismiss="modal" disabled={! Title || !Description || !Excerpt  } >Update</button>
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

              const img:any = formData.get('image')
              if(img.name != ''){
                const imgEx = getExtension(img.name)
                if(imgEx != "png" && imgEx != "jpeg" && imgEx != "jpg"){
                  Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Type image incorrect",
                    showConfirmButton: true
                    // timer: 1500
                  });
                  return
                }
              }


            let s = await Func_add_data(formData)
            if (s == 200) {
              setTimeout(() => {
                listData(currentPage)
                set_handle_image('')
                set_atitle('')
                set_aexe('')
                set_ades('')

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
              // // // console.log('error')
            }

          }} >
            <div className="modal-header bg-success text-white ">
              <h5 className="modal-title" id="staticBackdropLabel">Add data</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className='row' id="add_data" >
                <div className='col-3 fw-bold' >Title  </div>   <div className='col-9 fw-normal'> <input type="text" name="Title" value={atitle} onChange={(e) => set_atitle(e.target.value)} className="form-control" /> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'> <textarea name="Description" value={ades} onChange={(e) => set_ades(e.target.value)} className='form-control' ></textarea> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Excerpt  </div>         <div className='col-9 fw-normal'> <input type="text" name="Excerpt" value={aexe} onChange={(e) => set_aexe(e.target.value)} className="form-control" /> </div>
                <hr className='my-3' />
                <div className='col-3 fw-bold' >Image  </div>         <div className='col-9 fw-normal'> <input type="file" name="image" value={handle_image} onChange={(e) => (set_handle_image(e.target.value) ,(e:any)=>{imageChange})} className="form-control" /> </div> 
                <div className='col-12'>
                  {dataLoad && (

                    <Image width={200} height={200} alt={"image ice"} src={URL.createObjectURL(new Blob([selectedImage], { type: "application/*" }))} />

                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-success" data-bs-dismiss="modal" disabled={!atitle || !ades || !aexe || !handle_image}>Add</button>
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
                  <div className='col-3 fw-bold' >Title  </div>         <div className='col-9 fw-normal'>  {att.Title} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'>  {att.Description} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Excerpt  </div>       <div className='col-9 fw-normal'>  {att.Excerpt} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >Date publish  </div>   <div className='col-9 fw-normal'>  {formatDateTH(att.Date_publish)} </div>
                  <hr className='my-3' />
                  <div className='col-3 fw-bold' >createdAt  </div>     <div className='col-9 fw-normal'>  {formatDateTH(att.createdAt)} </div>
                  <div className="col-12">
                    {dataLoad && (
                      <Image width={200} height={200} alt={"image ice"} src={selectedImage} className='mx-auto oneonone m-5'/>
                    )}
                  </div>

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