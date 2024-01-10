"use server"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}
export async function createThread({ text, author, communityId, path }: Params) {
    try {
        connectToDB();
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

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    try {
        connectToDB()
        const skip = (pageNumber - 1) * pageSize
        const postsQuery = Thread.find(
            { parentId: { $in: [null, undefined] } }).sort(
                { createdAt: "desc" }).skip(skip).limit(pageSize).populate({ path: "author", model: User }).populate({
                    path: "children", populate: {
                        path: "author",
                        model: User,
                        select: "_id name parentId image"
                    }
                })
        const totalPostCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

        const posts = await postsQuery.exec()
        const isNext = totalPostCount > skip + posts.length

        return { posts, isNext }
    } catch (error: any) {
        throw new Error(`Failed to fetch Posts: ${error.message}`)


    }
}

export async function fetchThreadById(id: String) {
    try {
        connectToDB()
        //TODO:  Populate community
        const thread = await Thread.findById(id).populate({ path: "author", model: User, select: "_id id name image" }).populate({
            path: "children",
            populate: [{
                path: "author",
                model: User,
                select: "_id id name parentId image"
            },
            {
                path: "children",
                model: Thread,
                populate: {
                    path: "author",
                    model: User,
                    select: "_id id name parentId image"
                }
            }]
        }).exec()
        return thread
    } catch (error: any) {
        throw new Error(`Failed to fetch thread by id: ${error.message}`)

    }

}
export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string) {
    try {
        connectToDB();
        const originalThread = await Thread.findById(threadId)
        if (!originalThread) {
            throw new Error("Thread not found!")
        }

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        const savedCommentThread = await commentThread.save();

        originalThread.children.push(savedCommentThread._id)

        await originalThread.save();

        revalidatePath(path)

    } catch (error: any) {
        throw new Error(`Failed to add comment to thread: ${error.message}`)

    }
}