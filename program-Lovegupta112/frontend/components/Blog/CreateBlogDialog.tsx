"use client";
import { Button } from "@/components/retroui/Button";
import { Dialog } from "@/components/retroui/Dialog";
import { Text } from "@/components/retroui/Text";
import { Label } from "@/components/retroui/Label";
import { Input } from "@/components/retroui/Input";
import { Textarea } from "@/components/retroui/Textarea";
import { useState, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { BlogProgramUtils, getProgram } from "@/utils/anchorClient";
import { SystemProgram } from "@solana/web3.js";
import { useAlert } from "@/providers/AlertProvider";
import { Program } from "@coral-xyz/anchor";
import { BlogDapp } from "@/types/blog_dapp";

function CreateBlogDialog({setBlogAddedCount}:{setBlogAddedCount:React.Dispatch<React.SetStateAction<number>>}) {

   const [blogInfo,setBlogInfo]=useState({title:"write your title",description:"write your description"});
   const [error, setError] = useState<{ title?: string; description?: string }>({});
   const [isCreating, setIsCreating] = useState(false);
   const [isCreated, setIsCreated] = useState(false);
   const dialogCloseRef = useRef<HTMLButtonElement>(null);
   const wallet=useWallet();
   const {connection}=useConnection();
   const {showAlert}=useAlert();

const handleCreateBlog = async() => {
    const newError: { title?: string; description?: string } = {};
    if (!blogInfo.title.trim()) {
        newError.title = "Title is required";
    }
    if (!blogInfo.description.trim()) {
        newError.description = "Description is required";
    }
    setError(newError);

    if(!wallet.publicKey){
      console.log('no pubkey found ...');
      window.alert('no pubkey found ...');
      return;
    }

    if (Object.keys(newError).length === 0) {
        setIsCreating(true);
       try{
          const program=getProgram(connection,wallet) as unknown as Program<BlogDapp>;
         const [blog_pda] = BlogProgramUtils.getPDAs.getBlogPDA(blogInfo.title, wallet.publicKey!, program.programId);
         const res=await program.methods.addBlog(blogInfo.title,blogInfo.description)
         .accounts({
           blogAuthor:wallet.publicKey,
           blog:blog_pda,
           systemProgram:SystemProgram.programId
         }).rpc();
                  
         // Increment counter to trigger re-fetch
         setBlogAddedCount(prev => prev + 1);
         showAlert("blog created successfully!","success");
                  
         // Show close button
         setIsCreated(true);
        console.log('after creating blog res..',res);
       }
       catch(err){
        showAlert("error creating blog!","error");
       }
       finally {
        setIsCreating(false);
       }
    }
};

const handleClose = () => {
  // Reset states when closing
  setIsCreated(false);
  setIsCreating(false);
  setBlogInfo({title:"write your title",description:"write your description"});
  setError({});
  // Close dialog
  dialogCloseRef.current?.click();
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.name==="title"){
        setBlogInfo({ ...blogInfo, title: e.target.value });
    }
    else if(e.target.name==="description"){
        setBlogInfo({ ...blogInfo, description: e.target.value });
    }
    if (error.title) {
        setError({ ...error, title: '' });
    }   
};

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button>Create Blog</Button>
      </Dialog.Trigger>
      <Dialog.Content className="min-w-5/6">
        <Dialog.Header>
          <Text as="h5">Create your Blog</Text>
        </Dialog.Header>
        <section className="flex flex-col gap-8 p-4" >
          <section className="text-xl w-full h-80 flex flex-col gap-5">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title" className="font-extrabold">Your Blog Title</Label>
              <Input
                type="text"
                className="w-full"
                maxLength={30}
                id="title"
                placeholder="title"
                aria-invalid={error.title ? true : false}
                value={blogInfo.title}
                onChange={handleChange}
                name="title"
                disabled={isCreating}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description" className="font-extrabold">Your Best Blog Description</Label>
              <Textarea
                type="text"
                className="w-full resize-none"
                rows={7}
                id="description"
                placeholder="description"
                value={blogInfo.description}
                name="description"
                onChange={handleChange}
                disabled={isCreating}
              />
            </div>
            <Text as="h6">Made by @itzLg</Text>
          </section>
          <section className="flex w-full justify-end">
             <Dialog.Trigger asChild>
              <Button 
                ref={dialogCloseRef}
                className="hidden"
              >
                Hidden Close
              </Button>
             </Dialog.Trigger>
             <Button 
               onClick={isCreated ? handleClose : handleCreateBlog}
               disabled={isCreating}
               className="min-w-[100px]"
             >
               {isCreating ? (
                 <div className="flex items-center gap-2">
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                   Creating...
                 </div>
               ) : isCreated ? (
                 "Close"
               ) : (
                 "Create"
               )}
             </Button>
          </section>
        </section>
      </Dialog.Content>
    </Dialog>
  );
}

export default CreateBlogDialog;