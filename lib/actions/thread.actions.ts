"use server"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToBD } from "../mongoose"
interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}
export async function createThread({ text, author, communityId, path }: Params) {
    try {
        connectToBD();
        const createdThread = await Thread.create({
            text,
            author,
            community: communityId,
        })

        await User.findOneAndUpdate({ author }, {
            $push: { threads: createdThread.id }
        })

        revalidatePath(path)

    } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`)
    }
}