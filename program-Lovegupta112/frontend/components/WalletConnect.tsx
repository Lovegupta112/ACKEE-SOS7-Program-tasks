"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/retroui/Button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Dialog } from "@/components/retroui/Dialog";
import Image from "next/image";
import {
Menu
} from "@/components/retroui/Menu";

//handle wallet balance fixed to 2 decimal numbers without rounding
export function toFixed(num: number, fixed: number): string {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)![0];
}

const WalletConnection = () => {
  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect, connecting } = useWallet();

  const [open, setOpen] = useState<boolean>(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string>("");

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info?.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [publicKey, connection]);

  useEffect(() => {
    setUserWalletAddress(publicKey ? publicKey.toBase58()! : "");
  }, [publicKey]);

  const handleWalletSelect = async (walletName: any) => {
    if (walletName) {
      try {
        select(walletName);
        setOpen(false);
      } catch (error) {
        console.log("wallet connection err : ", error);
      }
    }
  };

  const handleDisconnect = async () => {
    disconnect();
  };


  return (
    <div className="text-white">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-2 items-center">
          {!publicKey ? (
            <>
              <Dialog.Trigger asChild>
                <Button className=" ring-2  md:h-[60px]  font-slackey z-50">
                  {connecting ? "connecting..." : "Connect Wallet"}
                </Button>
              </Dialog.Trigger>
            </>
          ) : (
            <Menu>
              <Menu.Trigger asChild>
                <Button className="flex gap-2 ring-black ring-2  font-slackey z-50">
                  <div className="">
                    <div className=" truncate md:w-[150px] w-[100px]">
                      {publicKey.toBase58()}
                    </div>
                  </div>
                  {balance ? (
                    <div>{toFixed(balance, 2)} SOL</div>
                  ) : (
                    <div>0 SOL</div>
                  )}
                </Button>
              </Menu.Trigger>
              <Menu.Content className="w-fit hover:bg-black">
                <Menu.Item className="flex justify-center">
                  <Button
                    className="bg-[#ff5555] z-50  hover:bg-black text-white   font-slackey"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </Menu.Item>
              </Menu.Content>
            </Menu>
          )}

          <Dialog.Content
            className="max-w-[450px] "
            style={{
            //   borderRadius: "30px",
            }}
          >
            <div className="flex w-full justify-center items-center overflow-y-auto py-2">
              <div className="flex flex-col justify-start items-center space-y-5  w-[300px] overflow-hidden">
                {wallets.map((wallet) => (
                  <Button
                    key={wallet.adapter.name}
                    //onClick={() => select(wallet.adapter.name)}
                    onClick={() => handleWalletSelect(wallet.adapter.name)}
                    // variant={"ghost"}
                    className=" h-[40px] hover:bg-transparent hover:text-white text-[20px] text-white font-slackey flex w-full justify-center items-center "
                  >
                    <div className="flex">
                      <Image
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        height={30}
                        width={30}
                        className="mr-5 "
                      />
                    </div>
                    <div className="font-slackey text-white wallet-name text-[20px]">
                      {wallet.adapter.name}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog>
    </div>
  );
};

export default WalletConnection;