import { fetchUserPosts, fetchUserReplies } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}
const RepliesTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result = await fetchUserReplies(accountId);
 
  if (!result) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10 ">
      {result.map((reply: any) => (
        <ThreadCard
          key={reply._id}
          id={reply._id}
          currentUserId={currentUserId}
          parentId={reply.parentId}
          content={reply.text}
          author={
            accountType === "User"
              ? {
                  name: reply.author.name,
                  image: reply.author.image,
                  id: reply.author.id,
                }
              : {
                  name: reply.author.name,
                  image: reply.author.image,
                  id: reply.author.id,
                }
          }
          createdAt={reply.createdAt}
          comments={reply.children}
        />
      ))}
    </section>
  );
};
export default RepliesTab;
