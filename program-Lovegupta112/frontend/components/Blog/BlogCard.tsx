"use client";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import BlogDialog from "./BlogDialog";
import { ArrowBigUp, ArrowBigDown, Bookmark } from "lucide-react";
import { useCallback, useState, useRef } from "react";
import { PublicKey } from "@solana/web3.js";
import GenericDialog from "../GenericDialog";
import { BlogData, BlogReactionData, CommentData, UserTipData } from "@/types/blogTypes";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { BlogProgramUtils, getProgram } from "@/utils/anchorClient";
import { Program } from "@coral-xyz/anchor";
import { BlogDapp } from "@/types/blog_dapp";
import TipDialog from "../TipDialog";

const TitleLength = 20;
const DescLen = 150;

enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'disLike'
}

const BlogCard = ({
  blogData,
  userBookmarkData,
  reactions,
  onReactionUpdate,
  onBookmarkUpdate,
  userTipsData,
  onBlogUpdate
}: {
  blogData: BlogData;
  userBookmarkData?: {
    publicKey: PublicKey;
    account: {
      bookmarkAuthor: PublicKey;
      relatedBlog: PublicKey;
    };
  };
  reactions: Array<BlogReactionData>;
  onReactionUpdate: (blogPkey: PublicKey, newReaction: BlogReactionData | null, operation: string, oldReactionKey?: PublicKey) => void;
  onBookmarkUpdate: (blogPkey: PublicKey, bookmark: unknown | null) => void;
  userTipsData:Array<UserTipData>,
  onBlogUpdate?: (blogPkey: PublicKey, updatedFields: Partial<BlogData['account']>) => void; 
}) => {
  const { account } = blogData;
  const blogPkey = blogData.publicKey;
  
  // Use lazy loading for comments - only load when dialog opens
  const [comments, setComments] = useState<Array<CommentData>>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  
  // Prevent duplicate comment fetches
  const loadingRef = useRef(false);

  const wallet = useWallet();
  const { connection } = useConnection();

  // Find user's current reaction (memoized)
  const userReaction = reactions?.find((reaction) =>
    reaction?.account?.reactionAuthor?.toString() === wallet?.publicKey?.toString()
  );

  const hasLiked = userReaction && Object.keys(userReaction.account.reaction)[0] === ReactionType.LIKE;
  const hasDisliked = userReaction && Object.keys(userReaction.account.reaction)[0] === ReactionType.DISLIKE;

  // Lazy load comments only when needed (when dialog opens)
  const fetchComments = useCallback(async () => {
    if (!wallet.publicKey || !blogPkey || loadingRef.current || commentsLoaded) {
      return comments; // Return existing comments if already loaded
    }

    loadingRef.current = true;
    setCommentsLoading(true);
    
    try {
      const program = getProgram(connection, wallet);
      const commentsData = await BlogProgramUtils.getBlogComments(
        program as unknown as Program<BlogDapp>,
        blogPkey
      );
      setComments(commentsData);
      setCommentsLoaded(true);
      return commentsData;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    } finally {
      setCommentsLoading(false);
      loadingRef.current = false;
    }
  }, [wallet.publicKey?.toString(), blogPkey.toString(), connection, commentsLoaded]);

  // Fixed callback for handling operations
  const handleOperationSuccess = useCallback((operation: string, data?: any ) => {
    console.log('Operation:', operation, 'Data:', data);
    
    switch (operation) {
      case 'add like':
        // When adding a like, pass the old reaction key to remove any existing reaction
        onReactionUpdate(blogPkey, data, operation, userReaction?.publicKey);
        break;
      case 'remove like':
        // When removing, only pass the old reaction key, no new reaction
        onReactionUpdate(blogPkey, null, operation, userReaction?.publicKey);
        break;
      case 'add dislike':
        // When adding a dislike, pass the old reaction key to remove any existing reaction
        onReactionUpdate(blogPkey, data, operation, userReaction?.publicKey);
        break;
      case 'remove dislike':
        // When removing, only pass the old reaction key, no new reaction
        onReactionUpdate(blogPkey, null, operation, userReaction?.publicKey);
        break;
      case 'added bookmark':
        onBookmarkUpdate(blogPkey, data);
        break;
      case 'removed bookmark':
        onBookmarkUpdate(blogPkey, null);
        break;
      case 'add comment':
        if (data?.comment) {
          setComments(prev => [...prev, data.comment]);
        }
        break;
      case 'remove comment':
        if (data?.commentKey) {
          setComments(prev => prev.filter(c => !c.publicKey.equals(data.commentKey)));
        }
        break;
      case 'refresh comments':
        // Force refetch comments
        setCommentsLoaded(false);
        fetchComments();
        break;
      case 'updated blog':
        if (data?.newContent && onBlogUpdate) {
        onBlogUpdate(blogPkey, { content: data.newContent });
         }
        break;
      default:
        console.warn('Unknown operation:', operation);
        break;
    }
  }, [blogPkey.toString(), onReactionUpdate, onBookmarkUpdate, userReaction?.publicKey?.toString(), fetchComments]);

  return (
    <div>
      <Card className="w-90 overflow-hidden cursor-pointer">
        <Card.Header className="h-50">
          <Card.Title className="flex justify-between items-center">
            <div>
                 {`${
              account?.title?.length > TitleLength
                ? `${account?.title?.slice(0, TitleLength)}...`
                : account?.title
            }`}
            </div>
            <div>
                <TipDialog blogPkey={blogData?.publicKey} blogAuthor={blogData?.account?.blogAuthor} userTipsData={userTipsData} />
            </div>
          </Card.Title>
          <Card.Description>
            {`${
              account?.content?.length > DescLen
                ? `${account?.content?.slice(0, DescLen)}...`
                : account?.content
            }`}
          </Card.Description>
           
        </Card.Header>
        
        <div className="p-3 flex justify-between items-center">
          <BlogDialog
            title={account?.title}
            description={account?.content}
            blogAuthor={blogData?.account.blogAuthor} 
            comments={comments}
            commentsLoading={commentsLoading}
            onUpdate={handleOperationSuccess}
            onDialogOpen={fetchComments} 
            blogPkey={blogPkey}
          />
          
          <div className="flex gap-4">
            {/* Like button */}
            <div className="flex gap-1 items-center">
              <Text className="text-sm">{blogData?.account?.likes?.toString() || '0'}</Text>
              <GenericDialog
                name="like"
                type={hasLiked ? "remove" : "add"}
                blogPkey={blogPkey}
                author={userReaction?.account?.reactionAuthor}
                itemKey={userReaction?.publicKey}
                onSuccess={handleOperationSuccess}
              >
                <ArrowBigUp
                  className="cursor-pointer hover:scale-110 transition-transform"
                  size={20}
                  fill={hasLiked ? "lightblue" : "none"}
                  color={hasLiked ? "blue" : "currentColor"}
                />
              </GenericDialog>
            </div>
            
            {/* Dislike button */}
            <div className="flex gap-1 items-center">
              <Text className="text-sm">{blogData?.account?.dislikes?.toString() || '0'}</Text>
              <GenericDialog
                name="dislike"
                type={hasDisliked ? "remove" : "add"}
                blogPkey={blogPkey}
                author={userReaction?.account?.reactionAuthor}
                itemKey={userReaction?.publicKey}
                onSuccess={handleOperationSuccess}
              >
                <ArrowBigDown
                  className="cursor-pointer hover:scale-110 transition-transform"
                  size={20}
                  fill={hasDisliked ? "orange" : "none"}
                  color={hasDisliked ? "red" : "currentColor"}
                />
              </GenericDialog>
            </div>
            
            {/* Bookmark button */}
            <div className="flex gap-1 items-center">
              <Text className="text-sm">{blogData?.account?.bookmarked?.toString() || '0'}</Text>
              <GenericDialog
                name="bookmark"
                type={userBookmarkData ? "remove" : "save"}
                author={userBookmarkData?.account?.bookmarkAuthor}
                blogPkey={blogPkey}
                itemKey={userBookmarkData?.publicKey}
                onSuccess={handleOperationSuccess}
              >
                <Bookmark
                  className="cursor-pointer hover:scale-110 transition-transform"
                  size={20}
                  fill={userBookmarkData ? "green" : "none"}
                  color={userBookmarkData ? "green" : "currentColor"}
                />
              </GenericDialog>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BlogCard;