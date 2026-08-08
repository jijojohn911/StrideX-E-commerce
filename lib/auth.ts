import jwt, { SignOptions } from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
};
export const verifyToken = (token:string):JwtPayload | null =>{
    try {
           return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
         return null;
    }
}


export const getAuthUser = (request:NextRequest)=>{
  const token = request.cookies.get("token")?.value;
  if(!token) return null;
  return verifyToken(token)
};