import Image from "next/image";
import { blo } from "blo";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address } from "~~/components/scaffold-eth";
import { useSmartAccount } from "~~/hooks/burnerWallet/useSmartAccount";

const Home: NextPage = () => {
  const { scaAddress } = useSmartAccount();

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 flex flex-col items-center">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">SE-2 Smart Wallet</span>
          </h1>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          {scaAddress && (
            <Image
              alt={scaAddress}
              className="rounded-xl"
              src={blo(scaAddress as `0x${string}`)}
              width={200}
              height={200}
            />
          )}
          <Address address={scaAddress} size="lg" />
        </div>
      </div>
    </>
  );
};

export default Home;
