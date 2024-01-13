import mongoose from "mongoose";
import { boolean } from "zod";

const communitySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    creadtedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    bio: {
        type: String,
    },
    image: {
        type: String,
    },
    threads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread"
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

const Community = mongoose.models.User || mongoose.model("Community", communitySchema);
export default Community