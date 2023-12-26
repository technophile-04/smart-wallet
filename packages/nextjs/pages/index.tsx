import { useState } from "react";
import Image from "next/image";
import { blo } from "blo";
import type { NextPage } from "next";
import { QRCodeSVG } from "qrcode.react";
import { MetaHeader } from "~~/components/MetaHeader";
import QrCodeSkeleton from "~~/components/burnerwallet/QRCodeSkeleton";
import { Address, Balance, EtherInput } from "~~/components/scaffold-eth";
import { useSmartAccount } from "~~/hooks/burnerWallet/useSmartAccount";

const Home: NextPage = () => {
  const { scaAddress } = useSmartAccount();
  const [etherInput, setEtherInput] = useState("0.1");

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
        <div className="space-y-4 flex flex-col items-center bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-8 py-8">
          {scaAddress ? (
            <>
              <div className="relative shadow-xl rounded-xl">
                <QRCodeSVG className="rounded-xl" value={scaAddress} size={230} />
                <Image
                  alt={scaAddress}
                  className="rounded-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl border-2 border-black"
                  src={blo(scaAddress as `0x${string}`)}
                  width={50}
                  height={50}
                />
              </div>
              <Address address={scaAddress} size="lg" />
              <div className="flex gap-1 items-center">
                <span className="text-xl font-semibold">Balance:</span>
                <Balance address={scaAddress} className="px-0 py-0 mt-1 text-lg" />
              </div>
            </>
          ) : (
            <QrCodeSkeleton />
          )}
          <EtherInput value={etherInput} onChange={setEtherInput} />
          <button className="btn btn-primary rounded-xl" disabled={!scaAddress}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
