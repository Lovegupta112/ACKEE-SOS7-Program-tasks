import { Button } from "@/components/retroui/Button";
import { Dialog } from "@/components/retroui/Dialog";
import { Text } from "@/components/retroui/Text";
import { BlogProgramUtils, getProgram } from "@/utils/anchorClient";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useAlert } from "@/providers/AlertProvider";
import { useState, useRef } from "react";

export default function GenericDialog({
  name,
  type,
  author,
  blogPkey,
  itemKey,
  children,
  onSuccess,
}: {
  name: string;
  type: string;
  author?: PublicKey;
  blogPkey: PublicKey;
  itemKey?: PublicKey;
  children?: React.ReactNode;
  onSuccess?: (operation: string, data?: any) => void;
}) {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { showAlert } = useAlert();
  const program = getProgram(connection, wallet);
  
  // Prevent double execution
  const [isExecuting, setIsExecuting] = useState(false);
  const executionRef = useRef(false);

  const handleConfirm = async () => {
    if (!wallet.publicKey) {
      console.log("no pubkey found ...");
      showAlert("No wallet connected", "error");
      return;
    }

    // Prevent double execution
    if (isExecuting || executionRef.current) {
      console.log("Already executing, skipping...");
      return;
    }

    setIsExecuting(true);
    executionRef.current = true;

    try {
      if (name === "Delete" && type === "comment") {
        if (!itemKey) {
          showAlert("No itemKey provided for deleting comment.", "error");
          return;
        }
        
        const res = await program?.methods
          .removeCommentBlog()
          .accounts({
            commentAuthor: author as PublicKey,
            comment: itemKey,
          })
          .rpc();
          
        showAlert("Comment deleted successfully", "success");
        onSuccess?.("deleted comment");

      } else if (name === "like") {
        if (type === "add") {
          const [like_pda] = BlogProgramUtils.getPDAs.getReactionPDA(
            blogPkey,
            wallet.publicKey,
            program?.programId as PublicKey
          );
          
          console.log("Adding like reaction...");
          const res = await program?.methods
            .likeBlog()
            .accounts({
              reactionAuthor: wallet.publicKey,
              reaction: like_pda,
              blog: blogPkey,
              systemProgram: SystemProgram.programId,
            })
            .rpc();
            
          const reactionData = {
            publicKey: like_pda,
            account: {
              reactionAuthor: wallet.publicKey,
              relatedBlog: blogPkey,
              reaction: { like: {} }
            }
          };
          
          console.log("Like added successfully, calling onSuccess");
          showAlert("Blog liked successfully", "success");
          onSuccess?.("add like", reactionData);
          
        } else if (type === "remove") {
          console.log("Removing like reaction...");
          const res = await program?.methods
            .removeReactionBlog()
            .accounts({
              reactionAuthor: author as PublicKey,
              reaction: itemKey as PublicKey,
              blog: blogPkey,
            })
            .rpc();
            
          console.log("Like removed successfully, calling onSuccess");
          showAlert("Like removed successfully", "success");
          onSuccess?.("remove like");
        }

      } else if (name === "dislike") {
        if (type === "add") {
          const [dislike_pda] = BlogProgramUtils.getPDAs.getReactionPDA(
            blogPkey,
            wallet.publicKey,
            program?.programId as PublicKey
          );
          
          console.log("Adding dislike reaction...");
          const res = await program?.methods
            .dislikeBlog()
            .accounts({
              reactionAuthor: wallet.publicKey,
              reaction: dislike_pda,
              blog: blogPkey,
              systemProgram: SystemProgram.programId,
            })
            .rpc();
            
          const reactionData = {
            publicKey: dislike_pda,
            account: {
              reactionAuthor: wallet.publicKey,
              relatedBlog: blogPkey,
              reaction: { disLike: {} }
            }
          };
          
          console.log("Dislike added successfully, calling onSuccess");
          showAlert("Blog disliked successfully", "success");
          onSuccess?.("add dislike", reactionData);
          
        } else if (type === "remove") {
          console.log("Removing dislike reaction...");
          const res = await program?.methods
            .removeReactionBlog()
            .accounts({
              reactionAuthor: author as PublicKey,
              reaction: itemKey as PublicKey,
              blog: blogPkey,
            })
            .rpc();
            
          console.log("Dislike removed successfully, calling onSuccess");
          showAlert("Dislike removed successfully", "success");
          onSuccess?.("remove dislike");
        }

      } else if (name === "bookmark") {
        if (type === "save") {
          const [bookmark_pda] = BlogProgramUtils.getPDAs.getBookmarkPDA(
            blogPkey,
            wallet.publicKey,
            program?.programId as PublicKey
          );
          
          const res = await program?.methods
            .saveBlog()
            .accounts({
              bookmarkAuthor: wallet.publicKey,
              bookmark: bookmark_pda,
              blog: blogPkey,
              systemProgram: SystemProgram.programId,
            })
            .rpc();
            
          const bookmarkData = {
            publicKey: bookmark_pda,
            account: {
              bookmarkAuthor: wallet.publicKey,
              relatedBlog: blogPkey,
            }
          };
          
          showAlert("Blog bookmarked successfully", "success");
          onSuccess?.("added bookmark", bookmarkData);
          
        } else if (type === "remove") {
          const res = await program?.methods
            .unsaveBlog()
            .accounts({
              bookmarkAuthor: author as PublicKey,
              bookmark: itemKey as PublicKey,
              blog: blogPkey,
            })
            .rpc();
            
          showAlert("Bookmark removed successfully", "success");
          onSuccess?.("removed bookmark");
        }
      }
    } catch (error) {
      console.error(`Error while ${name}:`, error);
      showAlert(`Error while ${name}`, "error");
    } finally {
      // Reset execution flags after a delay to prevent rapid successive clicks
      setTimeout(() => {
        setIsExecuting(false);
        executionRef.current = false;
      }, 1000);
    }
  };

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        {children || <Button>{name}</Button>}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Text as="h5">Confirm your {name} action?</Text>
        </Dialog.Header>
        <section className="flex flex-col gap-4 p-4">
          <section className="text-xl">
            <p>Are you sure you want to {type} this?</p>
          </section>
          <section className="flex w-full justify-end">
            <Dialog.Trigger asChild>
              <Button 
                onClick={handleConfirm}
                disabled={isExecuting}
              >
                {isExecuting ? "Processing..." : "Confirm"}
              </Button>
            </Dialog.Trigger>
          </section>
        </section>
      </Dialog.Content>
    </Dialog>
  );
}