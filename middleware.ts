import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {

  const ck = request.cookies.get("token")
  let status = 0

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer "+ck?.value);

  const requestOptions:any = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  const res = await fetch("https://dashboard.myhuahin.co/api/users/me", requestOptions)

  if(request.nextUrl.pathname === "/"){

    if(res.status != 200){
      return NextResponse.redirect(new URL("/login",request.url))
    }

  }

}

