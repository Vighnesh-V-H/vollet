"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { unlockPasswordSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";
import { isNewUser } from "@/lib/user";

type PasswordFormData = z.infer<typeof unlockPasswordSchema>;

export default function UnlockForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { unlock, isUnlocked } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (isUnlocked) {
      router.push("/home");
      return;
    }
    if (isNewUser()) {
      router.push("/");
    } else {
      router.push("/unlock");
    }
  }, [isNewUser, isUnlocked]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(unlockPasswordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    const isUnlock = await unlock(data.password);
    if (!isUnlock) {
      setError("Wrong Password");
    }
  };

  return (
    <Card className='w-full  max-w-md bg-white dark:bg-black border-gray-200 dark:border-gray-800'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold text-black dark:text-white'>
          Vollet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='password' className='text-black dark:text-white'>
              Password
            </Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
                className='bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700 pr-10'
                {...register("password")}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                )}
                <span className='sr-only'>
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {error && (
              <p className='text-sm text-red-500 dark:text-red-400'>{error}</p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
            disabled={isSubmitting}>
            {isSubmitting ? "Unlocking..." : "Unlock"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
