
import z from "zod";

export const addItemSchema = z.object({
    productId:z.string().min(1),
    size:z.string().min(1),
    color:z.string().min(1),
    quantity:z.number().int().positive().default(1),
})


export const updateItemSchema = z.object({
    productId:z.string().min(1),
    size:z.string().min(1),
    color:z.string().min(1),
    quantity:z.number().int().positive()
});

export const deleteItemSchema = z.object({
    productId:z.string().min(1),
    size:z.string().min(1),
    color:z.string().min(1),
})