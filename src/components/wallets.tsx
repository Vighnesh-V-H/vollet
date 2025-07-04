import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

interface Wallet {
  blockChainName: string;
  publicKey: string;
}

interface WalletProp {
  allWallets: Wallet[];
}

function WalletButton({ allWallets }: WalletProp) {
  return (
    <div className='space-y-2'>
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>

        <DrawerContent className='h-full'>
          <DrawerHeader>
            <DrawerTitle>Wallets</DrawerTitle>
          </DrawerHeader>
          <div>
            {allWallets.map((wallet, index) => (
              <div
                key={index}
                className='dark:bg-[#1b1b1b] dark:text-white text-black bg-[#fff] w-fit  mx-auto p-4 rounded-md shadow-md'>
                <p>
                  <strong>WalletName:</strong>Wallet 1
                </p>
                <p>
                  <strong>Public Key:</strong> {wallet.publicKey}
                </p>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default WalletButton;
