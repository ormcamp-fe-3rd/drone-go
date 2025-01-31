import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { SubmitHandler,useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import { userLogin } from "@/api/userApi";
import { AuthContext } from "@/contexts/AuthContext";

interface LoginInput{
  id: string;
  password: string;
}

export const LoginForm = ({onSuccess}: { onSuccess: () => void;}) => {
    const { register, handleSubmit, formState: {errors} } = useForm<LoginInput>()
    const { setIsAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const loginMutation = useMutation({
      mutationFn: async ({id, password}: {id: string, password: string}) => {
        return await userLogin(id, password);
      },
      onSuccess: (data) => {
        setIsAuth(true);
        localStorage.setItem("token", data);
        setTimeout(()=> {
          alert("Welcome aboard!");
        },0)
        navigate("/");
        onSuccess();
      },
      onError: (error) => {
        alert("Login failed. Please check your ID and password.");
        console.error(error);
      }
    })

    const onSubmit: SubmitHandler<LoginInput> = (input) => {
      loginMutation.mutate(input);
    };
    
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-center"
    >
      <input
        placeholder="ID"
        className="h-[3rem] w-[30rem] rounded-[10px] border-[1px] border-[#B2B2B7] px-4 text-xl"
        autoFocus
        {...register("id", {
          required: "ID is required",
          minLength: {
            value: 4,
            message: "ID must be at least 4 characters long",
          },
        })}
        disabled={loginMutation.isPending}
      />
      <div className="text-sm text-red-500 h-10 leading-8">
        {errors.id?.message}
      </div>
      <input
        type="password"
        placeholder="Password"
        className="h-[3rem] w-[30rem] rounded-[10px] border-[1px] border-[#B2B2B7] px-4 text-xl"
        {...register("password", { required: "Password is required" })}
        disabled={loginMutation.isPending}
      />
      <div className="text-sm text-red-500 h-10 leading-8 ">
        {errors.password?.message}
      </div>
      <button
        type="submit"
        className="mt-3 h-[3rem] w-[30rem] rounded-[10px] bg-black text-white"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Signing in..." : "SIGN IN"}
      </button>
    </form>
  );
}