import { NextResponse } from "next/server";
import { success } from "zod";

export const POST = async ()=>{
    const response =NextResponse.json({
        success:true,
        message:"logged out succesfully"
    })

    response.cookies.delete("token");
    return response
}