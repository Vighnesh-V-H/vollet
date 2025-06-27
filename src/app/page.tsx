import Header from "@/components/header";
import PasswordForm from "@/components/password-form";

export default function Home() {
  return (
    <div className='flex flex-col gap-8 dark:bg-black bg-white h-screen  items-center w-screen '>
      <Header />

      <PasswordForm />
    </div>
  );
}
