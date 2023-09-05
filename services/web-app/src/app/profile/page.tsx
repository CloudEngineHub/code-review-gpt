"use client";
import Loading from "@/components/loading/loading";
import { RepoTable } from "@/components/tables/repoTable";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useAxios from "../../lib/hooks/useAxios";
import { useEffect, useState } from "react";
import { User } from "../../lib/types";
import { ReturnToHome } from "../../components/cards/returnToHome";
import UpdateAPIKey from "@/components/dialog/updateApiKey";

export default function Profile(): JSX.Element {
  let user: User;
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { axiosInstance } = await useAxios();
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/getUser?userId=${session?.user?.id}`
        );
        setData(response.data);
      } catch (err: any) {
        console.log("Failed to getUser, due to the following error ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session?.user]);

  if (status === "loading" || loading) {
    return <Loading />;
  }

  if (!session) {
    return <ReturnToHome message="You are not logged in" />;
  }

  if (!data) {
    return <ReturnToHome message="Could not retrieve User data." />;
  } else {
    user = JSON.parse(data);
  }

  const handleUpdateApiKey = async (newApiKey: string) => {
    try {
      const { axiosInstance } = await useAxios();
      const response = await axiosInstance.post(`/updateUser`, {
        userID: user.userId,
        apiKey: newApiKey,
      });
      console.log("API key updated successfully:", response.data);
      console.log("Update API key is not available right now")
    } catch (error) {
      console.error("Failed to update API key:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl flex justify-right mt-10 mb-5 ml-10">
        My Profile
      </h1>
      <div className="flex flex-col p-5 mx-10">
        <div className="flex items-center mb-10">
          <div className="rounded-full overflow-hidden w-16 h-16">
            <Image
              src={user.pictureUrl ?? "/user.svg"}
              alt={"orion logo"}
              width={100}
              height={100}
            />
          </div>
          <h1 className="text-2xl ml-5">{user.email}</h1>
        </div>
        <UpdateAPIKey onSave={handleUpdateApiKey} />
        <RepoTable repos={user.repos} />
      </div>
    </>
  );
}
