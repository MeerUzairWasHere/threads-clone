"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToBD } from "../mongoose";

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
        connectToBD();
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
