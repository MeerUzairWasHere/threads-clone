"use server";

import Thread from "../models/thread.model";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";
import mongoose from 'mongoose'

interface Params {
    userId: string,
    username: string,
    name: string,
    path: string,
    bio: string,
    image: string,
}
export async function updateUser({
    userId,
    username,
    name,
    path,
    bio,
    image }: Params
): Promise<void> {
    try {
        connectToDB();
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name, bio, image, onboarded: true
            }, {
            upsert: true
        }
        );

        if (path === "/profile/edit") {
            revalidatePath(path)

        }
    } catch (error: any) {
        throw new Error("Failed to create/update user: " + error.message)
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB()
        return await User.findOne({ id: userId })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }

}
export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();

        // Find all threads authored by the user with the given userId
        const threads = await User.findOne({ id: userId }).populate({
            path: "threads",
            model: Thread,
            populate: [
                {
                    path: "children",
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: "name image id", // Select the "name" and "_id" fields from the "User"  
                    },
                },
            ],
        });
        return threads;
    } catch (error) {
        console.error("Error fetching user threads:", error);
        throw error;
    }
}

export async function fetchUserReplies(userId: string) {
    try {
        connectToDB();


        // Find the user by userId
        const user = await User.findOne({ id: userId })

        if (!user) {
            // Handle the case where the user is not found
            console.error("User not found");
            return null;
        }

        // Find all threads authored by the user with the given userId
        const replies = await Thread.find({
            author: user,
            parentId: { $exists: true }, // Assuming you have a field like parentId for replies
        }).populate({
            path: "author",
            model: User,
            select: "name image id",
        });

        return replies;
    } catch (error) {
        console.error("Error fetching user replies:", error);
        throw error;
    }
}


export async function fetchUsers(
    { userId,
        searchString = "",
        pageNumber = 1,
        pageSize = 20,
        sortBy = "desc" }: {
            userId: string;
            searchString?: string;
            pageNumber?: number;
            pageSize?: number;
            sortBy?: SortOrder;
        }) {
    try {
        connectToDB()

        //pagination

        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if (searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize)

        const totalUserCount = await User.countDocuments(query);

        const users = await usersQuery.exec();
        const isNext = totalUserCount > skipAmount + users.length;

        return { users, isNext }

    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();

        // Find all threads created by the user
        const userThreads = await Thread.find({ author: userId });

        // Collect all the child thread ids (replies) from the 'children' field of each user thread
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);

        // Find and return the child threads (replies) excluding the ones created by the same user
        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId }, // Exclude threads authored by the same user
        }).populate({
            path: "author",
            model: User,
            select: "name image _id",
        });

        return replies;

    } catch (error: any) {
        throw new Error(`Failed to fetch activity: ${error.message}`)
    }
}