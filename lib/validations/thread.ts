import * as z from "zod"

export const ThreadValidation = z.object({
    thread:z.string().min(1),
    accountId:z.string().min(1),
})
export const CommentValidation = z.object({
    thread:z.string().min(1),
})