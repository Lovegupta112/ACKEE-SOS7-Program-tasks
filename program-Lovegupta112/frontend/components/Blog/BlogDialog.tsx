"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "../retroui/Dialog";
import { Text } from "../retroui/Text";
import { Button } from "../retroui/Button";
import { Textarea } from "../retroui/Textarea";
import { PenIcon, SaveIcon, User } from "lucide-react";
import CommentBox from "../Comment/CommentBox";
import { BlogProgramUtils, getProgram } from "@/utils/anchorClient";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useAlert } from "@/providers/AlertProvider";
import { CommentData } from "@/types/blogTypes";

const BlogDialog = ({
  title,
  description,
  blogAuthor, 
  comments = [],
  commentsLoading = false,
  onUpdate,
  onDialogOpen,
  blogPkey,
}: {
  title: string;
  description: string;
  blogAuthor: PublicKey; // Blog author's public key
  comments?: Array<CommentData>;
  commentsLoading?: boolean;
  onUpdate?: (operation: string, data?: unknown) => void;
  onDialogOpen?: () => Promise<CommentData[]>;
  blogPkey: PublicKey;
}) => {
  const [status, setStatus] = useState<"none" | "edit">("none");
  const [updateDesc, setUpdateDesc] = useState(description);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [localComments, setLocalComments] = useState<CommentData[]>(comments);
  
  const wallet = useWallet();
  const { connection } = useConnection();
  const { showAlert } = useAlert();
  const program = getProgram(connection, wallet);

  // Check if current user is the blog author
  const isAuthor = wallet.publicKey && blogAuthor && wallet.publicKey.equals(blogAuthor);

  // Update local comments when props change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Handle dialog open - lazy load comments
  const handleDialogOpen = async (open: boolean) => {
    setIsOpen(open);
    
    if (open && onDialogOpen && localComments.length === 0) {
      try {
        const fetchedComments = await onDialogOpen();
        if (fetchedComments) {
          setLocalComments(fetchedComments);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    }
    
    // Reset edit mode when dialog closes
    if (!open && status === "edit") {
      setStatus("none");
      setUpdateDesc(description);
    }
  };

  const handleClick = async (action_type: "none" | "edit" | "save") => {
    if (action_type === "none" || action_type === "edit") {
      setStatus(action_type);
      return;
    }

    if (!wallet.publicKey) {
      showAlert("Please connect your wallet", "error");
      return;
    }

    if (!isAuthor) {
      showAlert("Only the blog author can edit this blog", "error");
      return;
    }

    if (isUpdating) {
      return;
    }

    // Validation
    if (!updateDesc.trim()) {
      showAlert("Content cannot be empty", "error");
      return;
    }

    if (updateDesc.trim() === description.trim()) {
      setStatus("none");
      return;
    }

    setIsUpdating(true);
    
    try {
      const [blog_pda] = BlogProgramUtils.getPDAs.getBlogPDA(
        title,
        blogAuthor, // Use blog author, not current wallet
        program?.programId as PublicKey
      );

      await program?.methods
        .updateBlog(updateDesc)
        .accounts({
          blogAuthor: wallet.publicKey, // Current wallet must be the author
          blog: blog_pda,
        })
        .rpc();

      showAlert("Blog updated successfully", "success");
      setStatus("none");
      onUpdate?.("updated blog", { newContent: updateDesc });
      
    } catch (err) {
      console.error("Error updating blog:", err);
      showAlert("Error updating blog", "error");
      setUpdateDesc(description);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateDesc(e.target.value);
  };

  const handleCommentUpdate = (
    blogPkey: PublicKey, 
    action: 'add' | 'remove' | 'refresh', 
    comment?: CommentData, 
    commentKey?: PublicKey
  ) => {
    // Update local state first for immediate UI feedback
    if (action === 'add' && comment) {
      setLocalComments(prev => [...prev, comment]);
      onUpdate?.("add comment", { comment });
    } else if (action === 'remove' && commentKey) {
      setLocalComments(prev => prev.filter(c => !c.publicKey.equals(commentKey)));
      onUpdate?.("remove comment", { commentKey });
    } else if (action === 'refresh') {
      onUpdate?.("refresh comments");
    }
  };

  const handleCancel = () => {
    setUpdateDesc(description);
    setStatus("none");
  };

  // Format author address for display
  const formatAuthorAddress = (author: PublicKey) => {
    const addr = author?.toString();
    console.log('author..',addr);
    return `${addr?.slice(0, 4)}...${addr?.slice(-4)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <Dialog.Trigger asChild>
        <Button >
          Read More
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="min-w-5/6  flex flex-col">
        <Dialog.Header className="flex justify-between">
          <div className="flex-1 p-4">
            <Text as="h3" >{title}</Text>
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
              <User size={16} />
              <span>Author: {formatAuthorAddress(blogAuthor)}</span>
              {isAuthor && (
                <span className="bg-black text-white px-2 py-1 rounded-full text-xs font-medium">
                  You
                </span>
              )}
            </div>
          </div>
        </Dialog.Header>
        
        <div className="flex flex-col gap-4 p-4 flex-grow overflow-hidden">
          {/* Blog Content Section */}
          <section className="w-full h-80 overflow-hidden border rounded-md">
            {status === "edit" ? (
              <div className="h-full p-2">
                <Textarea
                  placeholder="Edit your blog content..."
                  className="w-full h-full border-0 resize-none focus:outline-none focus:ring-0"
                  value={updateDesc}
                  onChange={handleChange}
                  disabled={isUpdating}
                />
              </div>
            ) : (
              <div className="w-full h-full overflow-y-auto p-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {updateDesc}
                </p>
              </div>
            )}
          </section>
          
          {/* Edit Button Section - Only show for blog author */}
          {isAuthor && (
            <section className="flex w-full justify-end border-b pb-2">
              {status === "none" ? (
                <Button 
                  onClick={() => handleClick("edit")} 
                  disabled={isUpdating || !wallet.publicKey}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <PenIcon size={16} />
                  Edit Blog
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isUpdating}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleClick("save")} 
                    disabled={isUpdating || updateDesc.trim() === description.trim()}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon size={16} />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </section>
          )}
          
          {/* Non-author message */}
          {!isAuthor && wallet.publicKey && (
            <section className="flex w-full justify-end border-b pb-2">
              <Text className="text-sm text-gray-500 italic">
                Only the blog author can edit this content
              </Text>
            </section>
          )}
        </div>
        
        {/* Comments Section - Only render when dialog is open */}
        {isOpen && (
          <div className="flex-shrink-0 max-h-96 overflow-hidden border-t bg-gray-50">
            <CommentBox 
              blogPkey={blogPkey} 
              comments={localComments}
              commentsLoading={commentsLoading}
              onCommentUpdate={handleCommentUpdate}
            />
          </div>
        )}
      </Dialog.Content>
    </Dialog>
  );
};

export default BlogDialog;