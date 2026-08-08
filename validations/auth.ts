import {z} from "zod"

export  const registerSchema =z.object({
    firstName:
    z.string()
    .trim()
    .min(2, "First name must be atleast 2 charaters")
    .max(10),


    lastName:
    z.string()
    .trim()
    .min(2)
    .max(10),


    username:
    z.string()
    .trim()
    .min(2)
    .max(20)
    .regex(
        /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),

   email: z.string()
   .trim()
   .email("Invalid email"),

    password: 
    z.string()
    .min(8, "Password must be at least 8 characters"),


     phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),
})

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;