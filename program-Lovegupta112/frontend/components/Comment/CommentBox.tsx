import { useEffect, useState, useCallback, useRef } from "react";
import { Input } from "@/components/retroui/Input";
import { Text } from "@/components/retroui/Text";
import { Accordion } from "@/components/retroui/Accordion";
import Comments from "./Comments";
import { SendHorizontal, Loader2 } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { BlogProgramUtils, getProgram } from "@/utils/anchorClient";
import { BlogDapp } from "@/types/blog_dapp";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useAlert } from "@/providers/AlertProvider";
import { CommentData } from "@/types/blogTypes";

const CommentBox = ({
  blogPkey,
  comments = [],
  commentsLoading = false,
  onCommentUpdate
}: {
  blogPkey: PublicKey;
  comments?: Array<CommentData>;
  commentsLoading?: boolean;
  onCommentUpdate?: (blogPkey: PublicKey, action: 'add' | 'remove' | 'refresh', comment?: CommentData, commentKey?: PublicKey) => void;
}) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [commentData, setCommentData] = useState<Array<CommentData>>(comments);
  const [isLoading, setIsLoading] = useState(false);
  
  // Prevent duplicate requests
  const isAddingRef = useRef(false);

  const wallet = useWallet();
  const { connection } = useConnection();
  const { showAlert } = useAlert();

  // Update local state when props change
  useEffect(() => {
    setCommentData(comments);
  }, [comments]);

  // Check if current user has already commented (memoized)
  const hasCommented = commentData.some(
    (c) => c.account.commentAuthor?.toString() === wallet.publicKey?.toString()
  );

  // Add new comment with optimistic updates
  const addComment = useCallback(async () => {
    if (!comment.trim()) {
      setError("Comment is required");
      return;
    }
    if (!wallet.publicKey) {
      showAlert('Please connect your wallet', 'error');
      return;
    }
    if (!blogPkey) {
      showAlert('Blog not found', 'error');
      return;
    }
    if (isAddingRef.current) {
      return; // Prevent duplicate requests
    }

    isAddingRef.current = true;
    setIsLoading(true);
    setError("");

    // Create optimistic comment for immediate UI feedback
    const tempComment: CommentData = {
      publicKey: new PublicKey("11111111111111111111111111111111"), // Temporary key
      account: {
        commentAuthor: wallet.publicKey,
        relatedBlog: blogPkey,
        content: comment,
        createdAt: Date.now()
      }
    };

    // Optimistically update UI
    setCommentData(prev => [...prev, tempComment]);
    const commentText = comment;
    setComment(""); // Clear input immediately

    try {
      const program = getProgram(connection, wallet) as unknown as Program<BlogDapp>;
      const [comment_pda] = BlogProgramUtils.getPDAs.getCommentPDA(
        commentText,
        blogPkey,
        wallet.publicKey,
        program.programId
      );

      await program.methods.commentBlog(commentText)
        .accounts({
          commentAuthor: wallet.publicKey,
          comment: comment_pda,
          blog: blogPkey,
          systemProgram: SystemProgram.programId
        }).rpc();

      // Create the actual comment data with real PDA
      const newComment: CommentData = {
        publicKey: comment_pda,
        account: {
          commentAuthor: wallet.publicKey,
          relatedBlog: blogPkey,
          content: commentText,
          createdAt: Date.now()
        }
      };

      // Replace the temporary comment with the real one
      setCommentData(prev => 
        prev.map(c => c.publicKey.toString() === tempComment.publicKey.toString() ? newComment : c)
      );
      
      // Notify parent component
      onCommentUpdate?.(blogPkey, 'add', newComment);
      showAlert('Comment added successfully', 'success');
      
    } catch (err) {
      console.error('Error adding comment:', err);
      showAlert('Error adding comment', 'error');
      
      // Rollback optimistic update on error
      setCommentData(prev => prev.filter(c => c.publicKey.toString() !== tempComment.publicKey.toString()));
      setComment(commentText); // Restore comment text
      
    } finally {
      setIsLoading(false);
      isAddingRef.current = false;
    }
  }, [comment, wallet.publicKey, blogPkey, connection, showAlert, onCommentUpdate]);

  // Handle comment deletion with optimistic updates
  const handleCommentDeleted = useCallback((commentKey: PublicKey) => {
    // Optimistically remove from local state
    setCommentData(prev => prev.filter(c => !c.publicKey.equals(commentKey)));
    // Notify parent component
    onCommentUpdate?.(blogPkey, 'remove', undefined, commentKey);
  }, [blogPkey, onCommentUpdate]);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
    if (error) {
      setError('');
    }
  }, [error]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !hasCommented && !isLoading && comment.trim()) {
      addComment();
    }
  }, [hasCommented, isLoading, comment, addComment]);

  return (
    <div className="p-4">
      <Accordion type="single" collapsible className="space-y-4 w-full">
        <Accordion.Item value="item-1">
          <Accordion.Header>
            Comments ({commentData.length})
          </Accordion.Header>
          <Accordion.Content>
            {/* Comment input section */}
            <div className="flex items-center h-11 mb-4">
              <Input
                type="text"
                placeholder={hasCommented ? "You can only comment once" : "Add your comment"}
                value={comment}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                aria-invalid={error ? true : false}
                disabled={hasCommented || isLoading}
                className="flex-1"
              />
              <div
                className={`h-full text-center cursor-pointer flex items-center justify-center px-3 ${
                  hasCommented || isLoading || !comment.trim() 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-gray-100 rounded-r"
                }`}
                onClick={() => {
                  if (!hasCommented && !isLoading && comment.trim()) addComment();
                }}
                tabIndex={hasCommented || isLoading ? -1 : 0}
                role="button"
                aria-disabled={hasCommented || isLoading}
                aria-label="Send comment"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <SendHorizontal 
                    className={`w-5 h-5 ${
                      hasCommented || isLoading || !comment.trim() 
                        ? "opacity-50" 
                        : "hover:text-blue-600"
                    }`} 
                  />
                )}
              </div>
            </div>
            
            {error && (
              <Text className="text-red-500 text-xs mb-2">{error}</Text>
            )}
            
            {hasCommented && (
              <Text className="text-yellow-600 text-xs mb-2">
                You have already commented on this blog
              </Text>
            )}

            {/* Comments display section */}
            <div className="h-40 overflow-y-auto space-y-3">
              {commentsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2 text-sm text-gray-500">Loading comments...</span>
                </div>
              ) : commentData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Text className="text-gray-500 text-sm">No comments yet. Be the first to comment!</Text>
                </div>
              ) : (
                commentData.map((comment) => (
                  <Comments
                    key={comment.publicKey.toString()}
                    data={comment}
                    currentUser={wallet.publicKey!}
                    blogPkey={blogPkey}
                    onCommentDeleted={handleCommentDeleted}
                  />
                ))
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default CommentBox;