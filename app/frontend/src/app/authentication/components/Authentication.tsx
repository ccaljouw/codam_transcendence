"use client"
import { useRouter } from "next/navigation";
import { constants } from "src/globals/constants.globalvar";



export default function login42Button() : JSX.Element {
  const router = useRouter();

  const handleLogin = () => {
    router.push(constants.API_LOGIN42);
  };

  return (
  <div className="text-center">
      <button onClick={handleLogin}>Login with OAuth</button>
  </div>
  );
} 
