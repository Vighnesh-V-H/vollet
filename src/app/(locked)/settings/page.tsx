import Link from "next/link";

function Settings() {
  return (
    <div className='flex flex-col'>
      <Link href={"/wallets"}> Back to wallets</Link>
      <div>Settings</div>
    </div>
  );
}

export default Settings;
