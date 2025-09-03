'use client'

import { getUser } from "@/utils/supabaseClient";
import { redirect } from "next/navigation";
import { useEffect } from "react";


export default function Index() {

  // useEffect(() => {
  //   const getSession = async () => {
  //     const { user, error } = await getUser();
  //     if (user) {
  //       redirect("/dashboard");
  //     } else {
  //       redirect("/auth");
  //     }
  //   };
  //   getSession();
  // }, []);

  return (
    <div>Redirecting...</div>
  );
}
