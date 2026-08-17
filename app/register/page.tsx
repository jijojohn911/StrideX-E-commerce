"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import{Eye,EyeOff} from "lucide-react"
const RegisterPage = () => {

    const router = useRouter();
    const [formData,setFormData]= useState({
        name:"",email:"",password:""
    })

const [showPassword, setShowPassword] = useState(false);

const [error,setError] =useState("");
const [loading,setLoading]=useState(false);

const handleChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
}

const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        const res= await fetch ("/api/auth/register",{
            method:"POST",
            headers:{"Context-type":"appication/json"},
             body: JSON.stringify(formData),
        })

       const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();

    } catch (error) {
        console.error(error)
        setError("Network error, Please try again");
        
    }finally{
        setLoading(false)
    }
}
  return (
    <div className="flex min-h-screen ">

        <div className="relative hidden w-1/2 flex-col justify-between bg-ink p-12 text-ivory lg:flex">
            <Link
            href="/" className="font-display text-2xl tracking-tight">
            STRIDEX
            </Link>
        </div>

        <div >
            <p className="eyebrow mb-4 text-champagne">
                Move different
                <h1 className="font-dispaly text-5xl lg:text-display-lg">Join the Movement</h1>
                <p className="">
                    Create an account to track orders,savwe faavorits and get early acces to drops
                </p>
            </p>
        </div>
    </div>
  )
}

export default RegisterPage