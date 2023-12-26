import { useState } from "react";
import Image from "next/image";
import { blo } from "blo";
import type { NextPage } from "next";
import { QRCodeSVG } from "qrcode.react";
import { parseEther } from "viem";
import { MetaHeader } from "~~/components/MetaHeader";
import QrCodeSkeleton from "~~/components/burnerwallet/QRCodeSkeleton";
import { Address, AddressInput, Balance, EtherInput } from "~~/components/scaffold-eth";
import { useSmartAccount } from "~~/hooks/burnerWallet/useSmartAccount";
import { useSmartTransactor } from "~~/hooks/burnerWallet/useSmartTrsansactor";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { scaAddress, scaSigner } = useSmartAccount();
  const [etherInput, setEtherInput] = useState("0.1");
  const [toAddress, setToAddress] = useState("");
  const transactor = useSmartTransactor();
  const [isTxnLoading, setIsTxnLoading] = useState(false);

  const handleSendEther = async () => {
    if (!scaSigner) {
      notification.error("Cannot access smart account");
      return;
    }
    setIsTxnLoading(true);
    try {
      const userOperationPromise = scaSigner.sendUserOperation({
        value: parseEther(etherInput),
        target: toAddress as `0x${string}`,
        data: "0x",
      });

      await transactor(() => userOperationPromise);
    } catch (e) {
      notification.error("Oops, something went wrong");
      console.error("Error sending transaction: ", e);
    } finally {
      setIsTxnLoading(false);
    }
  };

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
        <div className="space-y-4 flex flex-col items-center bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-8 py-8 w-[24rem] max-w-sm">
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
          <div className="divider text-xl">Send ETH</div>
          <AddressInput value={toAddress} placeholder="Receiver's address" onChange={setToAddress} />
          <EtherInput value={etherInput} onChange={setEtherInput} />
          <button
            className="btn btn-primary rounded-xl"
            disabled={!scaAddress || isTxnLoading}
            onClick={handleSendEther}
          >
            {isTxnLoading ? <span className="loading loading-spinner"></span> : "Send"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
