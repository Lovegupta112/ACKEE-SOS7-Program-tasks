import { Button } from "@/components/retroui/Button";
import { Dialog } from "@/components/retroui/Dialog";
import { Input } from "@/components/retroui/Input";
import { Text } from "@/components/retroui/Text";
import { useAlert } from "@/providers/AlertProvider";
import { BlogProgramUtils, getProgram } from "@/utils/anchorClient";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { UserTipData } from "@/types/blogTypes";
import BN from "bn.js";

export default function TipDialog({
  blogPkey,
  blogAuthor,
  userTipsData
}: {
  blogPkey: PublicKey;
  blogAuthor: PublicKey;
  userTipsData?: Array<UserTipData>;
}) {
  const [tipValue, setTipValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAlreadyTipped, setHasAlreadyTipped] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();
  const { showAlert } = useAlert();
  const program = getProgram(connection, wallet);

  const isSelfBlog = blogAuthor?.toString() === wallet?.publicKey?.toString();

  // Check if user has already tipped this blog
  useEffect(() => {
    if (userTipsData && wallet.publicKey) {
      const userTip = userTipsData.find(
        tip => tip.account.tipAuthor.toString() === wallet.publicKey!.toString() &&
               tip.account.relatedBlog.toString() === blogPkey.toString()
      );
      setHasAlreadyTipped(!!userTip);
    }
  }, [userTipsData, wallet.publicKey, blogPkey]);

  const handleSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.publicKey) {
      showAlert("Please connect your wallet", "error");
      return;
    }

    if (tipValue <= 0) {
      showAlert("Please enter a valid tip amount", "error");
      return;
    }

    if (hasAlreadyTipped) {
      showAlert("You have already tipped this blog", "warning");
      return;
    }

    setIsLoading(true);
    
    try {
      const [tip_pda] = BlogProgramUtils.getPDAs.getTipPDA(
        wallet.publicKey!,
        blogPkey,
        program?.programId as PublicKey
      );
      
      const tipAmountLamports = new BN(tipValue*LAMPORTS_PER_SOL)
      const res = await program?.methods
        .tipForBlog(tipAmountLamports)
        .accounts({
          tipAuthor: wallet?.publicKey as PublicKey,
          tip: tip_pda,
          blog: blogPkey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("tip done successfully", res);
      showAlert(`Tip of ${tipValue} SOL sent successfully!`, "success");
      setHasAlreadyTipped(true);
      setTipValue(0); // Reset tip value
    } catch (err) {
      console.log("error in tipping ...", err);
      showAlert("Error in sending tip", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isSelfBlog || hasAlreadyTipped || isLoading;

  const getButtonText = () => {
    if (isLoading) return "Processing...";
    if (hasAlreadyTipped) return "Already Tipped";
    if (isSelfBlog) return "Can't Tip Own Blog";
    return "Send Tip";
  };

  const getButtonClass = () => {
    if (isButtonDisabled) return "opacity-50 cursor-not-allowed";
    return "";
  };

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button 
        >
          {hasAlreadyTipped ? "Tipped" : "Tip"}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content size={"md"}>
        <Dialog.Header position={"fixed"}>
          <Text as="h5">Support this Blog</Text>
        </Dialog.Header>
        <form className="flex flex-col gap-4" onSubmit={handleSupport}>
          <div className="flex flex-col p-4 gap-4">
            <div className="flex-col gap-2">
              <label htmlFor="blogAuthor" className="font-extrabold">
                Blog Author:{" "}
                <span className="text-black font-light">
                  {blogAuthor.toString()}
                </span>
              </label>
            </div>
            
            {hasAlreadyTipped && (
              <div className="flex-col gap-2">
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  ✓ You have already tipped this blog!
                </div>
              </div>
            )}
            
            <div className="flex-col gap-2">
              <label htmlFor="tipAmount">
                SOL Amount <span className="text-red-500">*</span>
              </label>
              <Input
                id="tipAmount"
                placeholder="Enter tip amount in SOL"
                type="number"
                required
                value={tipValue}
                onChange={(e) => setTipValue(Number(e.target.value || 0))}
                disabled={hasAlreadyTipped || isLoading}
              />
            </div>
            
            {isSelfBlog && (
              <div className="text-orange-600 text-sm">
                You cannot tip your own blog.
              </div>
            )}
          </div>
          
          <Dialog.Footer>
            <Dialog.Trigger asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Dialog.Trigger>
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className={getButtonClass()}
            >
              {getButtonText()}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog>
  );
}