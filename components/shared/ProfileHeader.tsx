import Image from "next/image";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  imgUrl: string;
  username: string;
  bio: string;
}

const ProfileHeader = ({
  accountId,
  username,
  authUserId,
  name,
  imgUrl,
  bio,
}: Props) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className=" relative  object-cover w-20 h-20">
            <Image
              src={imgUrl}
              alt="Profile Image"
              fill
              className=" rounded-full object-cover  shadow-xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left  text-light-1 text-heading3-bold">
              {name}
            </h2>
            <p className=" text-base-medium text-gray-1 ">@{username}</p>
          </div>
        </div>
      </div>

      {/* TODO: Community */}

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};
export default ProfileHeader;
