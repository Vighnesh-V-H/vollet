import { ThemeToggle } from "./theme-toggle";

function Header() {
  return (
    <div className='flex mt-4 pl-4 pr-4 pt-2 items-center pb-2 rounded-3xl w-3/4 mx-auto dark:bg-[#23232398] dark:text-white text-background  bg-[#bebcbc87] justify-between'>
      <h1>Vollet</h1>
      <div className='flex gap-6 items-center'>
        <div className='cursor-pointer'>Lock</div>
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Header;
