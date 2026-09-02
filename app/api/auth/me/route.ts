
import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req:NextRequest)=>{

    try {
        
        const user = await getAuthUser(req);
        if (!user){
            return NextResponse.json(
                {success:false,
                    message:"Not authenticed"
                },
                {status:401}
            )
        }

        return NextResponse.json({
            success:true,
           user,
        })

    } catch (error) {
        console.error("Auth me error",error)

        return NextResponse.json(
            {
                success:false,
                message:"something went wrong"
            },
            {status:500}
        )
        
    }
}