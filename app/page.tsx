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
import { ToastContainer, toast } from 'react-toastify';


import 'dotenv/config'
import Modal from 'react-bootstrap/esm/Modal'
import Button from 'react-bootstrap/esm/Button'
const KEYTOKEN = process.env.KEYTOKEN;


const page = () => {
  function getExtension(filename:any) {
    return filename.split('.').pop()
  }

  // for add modal 
  const [atitle , set_atitle] = useState<string>('')
  const [ades , set_ades] = useState<string>('')
  const [aexe , set_aexe] = useState<string>('')
  const [modal_add, set_modal_add] = useState(false);
  const [modal_edit, set_modal_edit] = useState(false);
  const [modal_detail, set_modal_detail] = useState(false);
  const [modal_del, set_modal_del] = useState(false);
  const [btn , set_btn] =useState(false)
  const [isEmpty , set_isEmpty] = useState(false)

  const [new_data , set_new_data] = useState<any>()

  const [errors , set_errors] = useState('')
  const [sort, set_sort] = useState<boolean>(false)
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
  const [ast , set_ast] = useState<string>('')


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
    console.log("--> " + sort)
    allIndex()

    const token = Cookies.get('token')
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    console.log("current page is : : ",currentPage)
    console.log("HERE IS page : : ", page)
    if (currentPage != 0) {
      await fetch('https://dashboard.myhuahin.co/api/blogs/?pagination[pageSize]=' + rowsPerPage + '&populate=*' + '&pagination[page]=' + page  , requestOptions)
      .then(res => res.json())
      .then((d) => {
        if (d.data == null) { 
          setData([])
        } else {

          if(sort){
            setData(d.data.toReversed())
          }
          else{
            setData(d.data)
          }
          allIndex()
        }
        SetdataLoad(true)
      })

    }
    else {
      await fetch('https://dashboard.myhuahin.co/api/blogs/?pagination[pageSize]=' + rowsPerPage + '&populate=*'  , requestOptions).then(res => res.json()).then((d) => {
        if (d.data == null) {
          setData([])
        } else {
          if(sort){
            setData(d.data.toReversed())
          }
          else{
            setData(d.data)
          }
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
  const moreMore = async (ID: any , mode:string = "none") => {
    

    set_handle_image('')
    set_switch_image(false)
    set_setcret_id(ID)
    setstatus_fetch(false);
    const token = Cookies.get('token')

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const rem = await fetch(`https://dashboard.myhuahin.co/api/blogs/${ID}?populate=Image_cover`, requestOptions)
    const ram = await rem.json()
    set_isEmpty(false)
    rem.status == 200 ? set_isEmpty(false) : set_isEmpty(true)
    if(mode == "detail"){ set_modal_detail(true)}
    else if(mode == "del"){ set_modal_del(true)}
    else if(mode == "edit"){ set_modal_edit(true)}
    if(rem.status != 200 ){
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Data not found",
        showConfirmButton: true
        // timer: 1500
      });
      listData(currentPage)

      set_modal_add(false)
      set_modal_edit(false)
      set_modal_del(false)
      set_modal_detail(false)
      return
    }
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
    setstatus_fetch(true);

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
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data was deleted",
        showConfirmButton: true
        // timer: 1500
      });
      listData(currentPage)
    }, 100)
    set_modal_del(false)
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
  const func_edit = async (formData: FormData) => {
    let err = ""
    const img:any = formData.get('image')
    if(!formData.get('Title')){
      console.log(formData.get('Title'))
      err="Title is required!"
    }else if(!formData.get('Description')){
      console.log(formData.get('Description'))
      err="Description is required!"
    }else if(!formData.get('Excerpt')){
      console.log(formData.get('Excerpt'))
      err="Excerpt is required!"
    }
  
    if(err != ''){
      Swal.fire({
        position: "center",
        icon: "error",  
        title: err,
        showConfirmButton: true
        // timer: 1500
      });
      console.log('errors should trigger')
      return
    }

    setTimeout(()=>set_btn(true),1)
    // const arr = ['png,jpeg,jpg']
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
btn
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

    const res = await fetch("https://dashboard.myhuahin.co/api/blogs/" + secret_id, requestOptions)
    if(res.status != 200 ){
      set_modal_edit(false)
      listData(currentPage)
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "ฮันแน่ ผมรู้ต้องลองท่านี้",
        showConfirmButton: true
        // timer: 1500
      });
      set_btn(false)
      return
    }


    setTimeout(() => {
      set_modal_edit(false)
      listData(currentPage)
      set_btn(false)
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
    console.log("this is your value : " , value)
    listData(value);
    set_sort(false)
    set_currentPage(value)
  };

  const handleChangePage = async (
    // not neccessory
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

  const handle_btn_edit = (id:number) => {
    moreMore(id,"edit")
    set_modal_edit(true)
  }


  /**
  |--------------------------------------------------
  | preview image
  |--------------------------------------------------
  */
  const imageChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      set_switch_image(true)
      if(e.target.value != null || e.target.value != '' || e.target.value != 0){
        try{
          set_handle_image(e.target.value)
        }catch{
          alert('error')
        }
      }
    }
  }

  const removeImage = () => {
    set_modal_edit(false)
    set_switch_image(false)
    moreMore(secret_id)
  }

  const func_toggle = () =>{
    if(sort == true){
      allIndex()
      setTimeout(()=>{
        set_sort(false)
      },100)
      listData(currentPage)
    }
    else if(sort == false){
      allIndex()
      setTimeout(()=>{
        set_sort(true)
      },100)
      listData(currentPage)
    }
    console.log("sort is >>>>>>>>>" , sort , "<<<<<<<<<<")
  }


  return (
    <>
      <Navbar />
      <div className="container p-5">

        <div className="  ">
          {sort && (
            <div className="btn border-1 border text-xxl" onClick={func_toggle}>
              order by
            </div>
          )}
          {!sort && (
            <div className="btn border-1 border  text-xxl" onClick={func_toggle}>
              order by
            </div>
          )}

          {
            (isToken) && (
              <Button variant="modal-add" onClick={()=>set_modal_add(true)} className='btn-success btn float-end my-2'>+</Button>
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
              data.toReversed().map((e: any, index: number) => {
                const att = e?.attributes
                // // console.log("INDEX : " + att.Image_cover.data)
                return (
                  <tr key={index} >
                    <th scope="row">{(index + 1) + (currentPage * rowsPerPage) - rowsPerPage}</th>
                    {/* <th scope="row">{e.id}</th> */}
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
                      {
                        (isToken) && (
                          <button type="button" onClick={() => { moreMore(e.id,"detail") }} className='btn btn-info m-2'>Info</button>
                        )
                      }

                      {
                        (isToken) && (
                          <Button variant="primary" onClick={()=>handle_btn_edit(e.id)} className='btn btn-warning'> EDIT </Button>
                        )
                      }

                      {
                        (isToken) && (
                          <button type="button" onClick={() => { moreMore(e.id,"del") }}  className='btn btn-danger m-2'>Delete</button>
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
                <td colSpan={8}>Data empty</td>
              </tr>
            )}

          </tbody>
        </table>

        {dataLoad == true && data.length != 0 && (
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
        <Modal
        show={modal_detail}
        onHide={()=>set_modal_detail(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header  className='bg-info'>
          <Modal.Title>Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {status_fetch == true && isEmpty == false && (
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
          {status_fetch == false && (
            <div className='h-screen  grid justify-center content-center items-center text-xl'>Loading ... </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>set_modal_detail(false)} className="btn btn-secondary" >Close</Button>
        </Modal.Footer>
      </Modal>


      {
        /**
        |--------------------------------------------------
        | Modal for Edit 
        |--------------------------------------------------
        */
      }
       <Modal show={modal_edit} onHide={()=>set_modal_edit(false)} backdrop="static">
        <Modal.Header  className='bg-warning'>
          <Modal.Title>EDIT</Modal.Title>
        </Modal.Header>
        <form className="modal-content" action={(formData: FormData) => { func_edit(formData) }} >
        <Modal.Body>
          {status_fetch == true && isEmpty == false &&(
            <div className='row' id="add_data" >
              <div className='col-3 fw-bold' >Title  </div>   <div className='col-9 fw-normal'> <input type="text" name="Title" value={Title} onChange={(e) => set_Title(e.target.value)} id="" className="form-control" required/> </div>
              <hr className='my-3' />
              <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'> <textarea name="Description" value={Description} onChange={(e) => set_Description(e.target.value)} id="" className='form-control' required></textarea> </div>
              <hr className='my-3' />
              <div className='col-3 fw-bold' >Excerpt  </div>         <div className='col-9 fw-normal'> <input type="text" value={Excerpt} onChange={(e) => set_Excerpt(e.target.value)} name="Excerpt" id="" className="form-control" required/> </div>
              <hr className='my-3' />
              <div className='col-3 fw-bold' >Status  </div>       <div className='col-9 fw-normal'> <select name="Status" id="" className="form-control" value={status} onChange={(e) => set_status(e.target.value)} > <option value="false" >Unpublished</option> <option value="true">Published</option>  </select> </div>
              <hr className='my-3' />
              <div className='col-3 fw-bold' >Image </div>         <div className='col-9 fw-normal'> <input type="file" onChange={imageChange} name="image" id="" className="form-control"  accept=".jpg,.png,.jpeg" /> </div>
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
          )}
          {status_fetch == false && (
              <div className='h-screen  grid justify-center content-center items-center text-xl'>Loading ... </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={removeImage} disabled={btn}>
            Close
          </Button>
          {status_fetch == true && isEmpty == false && (
            <Button variant="primary" type='submit' className='btn btn-warning'  disabled={btn}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
        </form>
      </Modal>

      {
        /**
        |--------------------------------------------------
        | Modal for add data 
        |--------------------------------------------------
        */
      }
       <Modal show={modal_add}  onHide={()=> set_modal_add(false)} backdrop="static">
        <Modal.Header  className='bg-success text-white'>
          <Modal.Title >ADD DATA</Modal.Title>
        </Modal.Header>
          <form className="modal-content" ref={allField} action={async (formData: FormData) => {
            let err = ""

            const img:any = formData.get('image')
            if(!formData.get('Title')){
              console.log(formData.get('Title'))
              err="Title is required!"
            }else if(!formData.get('Description')){
              console.log(formData.get('Description'))
              err="Description is required!"
            }else if(!formData.get('Excerpt')){
              console.log(formData.get('Excerpt'))
              err="Excerpt is required!"
            }else if(img.name == ''){
              err="image is required!"
            }
         
            if(err != ''){
              Swal.fire({
                position: "center",
                icon: "error",  
                title: err,
                showConfirmButton: true
                // timer: 1500
              });
              console.log('errors should trigger')
              return
            }
            
            console.log('pass cuai')
            setTimeout(()=>set_btn(true),1)
            set_btn(true)
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
              set_modal_add(false)
              listData(currentPage)
              set_handle_image('')
              set_atitle('')
              set_aexe('')
              set_ades('')
              set_btn(false)
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
              set_btn(false)
            // when failed to add stuff
            // // // console.log('error')
            }

          }} >  
        <Modal.Body>

          <div className='row' id="add_data" >
            <div className='col-3 fw-bold' >Title  </div>   <div className='col-9 fw-normal'> <input type="text" name="Title" value={atitle} onChange={(e) => set_atitle(e.target.value)} className="form-control" required/> </div>
            <hr className='my-3' />
            <div className='col-3 fw-bold' >Description  </div>   <div className='col-9 fw-normal'> <textarea name="Description" value={ades} onChange={(e) => set_ades(e.target.value)} className='form-control' required></textarea> </div>
            <hr className='my-3' />
            <div className='col-3 fw-bold' >Excerpt  </div>         <div className='col-9 fw-normal'> <input type="text" name="Excerpt" value={aexe} onChange={(e) => set_aexe(e.target.value)} className="form-control" required/> </div>
            <hr className='my-3' />
            <div className='col-3 fw-bold' >Status  </div>       <div className='col-9 fw-normal'> <select name="Status" id="" className="form-control"  onChange={(e) => set_ast(e.target.value)} > <option value="false" >Unpublished</option> <option value="true">Published</option>  </select> </div>
            <hr className='my-3' />
            <div className='col-3 fw-bold' >Image  </div>         <div className='col-9 fw-normal'> <input type="file" name="image" id="0"  className="form-control"  accept=".png , .jpeg , .jpg" required/> </div> 
            {/* <div className='col-12'>
              {dataLoad && handle_image != '' && (
                <Image width={200} height={200} alt={"image ice"} src={URL.createObjectURL(new Blob([selectedImage], { type: "application/*" }))} className='mx-auto oneonone m-5'/>

              )}
            </div> */}
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>set_modal_add(false)} disabled={btn}> 
            Close
          </Button>
          <Button variant="modal-add" type='submit' className='btn btn-success'  disabled={btn} >
            ADD
          </Button>
        </Modal.Footer>
        </form>
      </Modal>

      {
        /**
        |--------------------------------------------------
        |   Modal for delete
        |--------------------------------------------------
        */
      }
       <Modal
        show={modal_del}
        onHide={()=>set_modal_del(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header  className='bg-danger'>
          <Modal.Title className='text-white ' >
         Delete !
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {status_fetch == true && (
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
          )}
          {status_fetch == false && (
            <div className='h-screen  grid justify-center content-center items-center text-xl'>Loading ... </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={()=>set_modal_del(false)}>Close</button>
          {status_fetch == true && isEmpty == false &&(
            <button type="button" className="btn btn-danger" onClick={() => { func_delete(secret_id) }} data-bs-dismiss="modal">Delete</button>
          )}
        </Modal.Footer>
      </Modal>

    </>
  )

}

export default page