import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { userLogin } from "@/api/userApi";


export const LoginForm = ({onSuccess}: { onSuccess: () => void;}) => {
    const [formData, setFormData] = useState({
      id: "",
      password: "",
    });
    const navigate = useNavigate();
    
    const loginMutation = useMutation({
      mutationFn: async ({id, password}: {id: string, password: string}) => {
        return await userLogin(id, password);
      },
      onSuccess: (data) => {
        localStorage.setItem("token", data);
        alert("Welcome aboard!");
        navigate("/");
        onSuccess();
      },
      onError: (error) => {
        console.log(error);
      }
    })

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      //TODO: 검증 로직 추가

      loginMutation.mutate(formData);
    };
    
  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      <input
        type="string"
        placeholder="ID"
        className="h-[3rem] w-[30rem] rounded-[10px] border-[1px] border-[#B2B2B7] px-4 text-xl"
        autoFocus
        value={formData.id}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, id: e.target.value }))
        }
        disabled={loginMutation.isPending}
      />
      <input
        type="password"
        placeholder="Password"
        className="mt-7 h-[3rem] w-[30rem] rounded-[10px] border-[1px] border-[#B2B2B7] px-4 text-xl"
        value={formData.password}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, password: e.target.value }))
        }
        disabled={loginMutation.isPending}
      />
      <button 
        type="submit"
        className="mt-10 h-[3rem] w-[30rem] rounded-[10px] bg-black text-white"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Signing in..." : "SIGN IN"}
      </button>
    </form>
  );
}