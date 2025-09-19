import BlogCard from "./BlogCard";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProgram, BlogProgramUtils } from "@/utils/anchorClient";
import { Program } from "@coral-xyz/anchor";
import { BlogDapp } from "@/types/blog_dapp";
import { PublicKey } from "@solana/web3.js";
import { BlogData, BlogReactionData, UserTipData } from "@/types/blogTypes";
import { useCallback, useEffect, useState, useRef } from "react";

const Blog = ({ blogAddedCount }: { blogAddedCount: number }) => {
  const [blogs, setBlogs] = useState<Array<BlogData>>([]);
  const [userBookmarks, setUserBookmarks] = useState<
    Array<{
      publicKey: PublicKey;
      account: {
        bookmarkAuthor: PublicKey;
        relatedBlog: PublicKey;
      };
    }>
  >([]);
  const [userTips, setUserTips] = useState<
    Array<UserTipData>
  >([]);
  const [blogReactions, setBlogReactions] = useState<Array<BlogReactionData>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();
  
  const isLoadingRef = useRef(false);
  const lastFetchRef = useRef<string>("");

  const getData = useCallback(async () => {
    const currentKey = `${wallet.publicKey?.toString()}-${blogAddedCount}`;
    
    // Prevent duplicate requests
    if (!wallet.publicKey || isLoadingRef.current || lastFetchRef.current === currentKey) {
      return;
    }

    isLoadingRef.current = true;
    lastFetchRef.current = currentKey;
    setIsLoading(true);

    try {
      const program = getProgram(connection, wallet) as unknown as Program<BlogDapp>;
      
      // Fetch all data in parallel
      const [blogsData, userBookmarkData, userTipsData] = await Promise.all([
        BlogProgramUtils.getAllBlogs(program),
        BlogProgramUtils.getUserBookmarks(program, wallet.publicKey),
        BlogProgramUtils.getUserTips(program, wallet.publicKey)
      ]);

      // Only fetch reactions for blogs that exist
      if (blogsData.length > 0) {
        const reactionsPromises = blogsData.map((blog: BlogData) =>
          BlogProgramUtils.getBlogReactions(program, blog.publicKey).catch(() => [])
        );
        const reactionsArray = await Promise.all(reactionsPromises);
        const allReactions = reactionsArray.flat();
        setBlogReactions(allReactions);
      } else {
        setBlogReactions([]);
      }

      // Update states in batch
      setUserBookmarks(userBookmarkData);
      setBlogs(blogsData);
      setUserTips(userTipsData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      // Reset states on error
      setBlogs([]);
      setBlogReactions([]);
      setUserBookmarks([]);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [wallet.publicKey?.toString(), connection, blogAddedCount]);

  const updateBlogReaction = useCallback((
    blogPkey: PublicKey, 
    newReaction: BlogReactionData | null, 
    operation: string,
    oldReactionKey?: PublicKey,
  ) => {
    console.log('updateBlogReaction:', { operation, hasNewReaction: !!newReaction, hasOldReaction: !!oldReactionKey });

    // Update reactions state
    setBlogReactions(prev => {
      let updated = [...prev];
      
      // Remove old reaction if it exists
      if (oldReactionKey) {
        updated = updated.filter(r => !r.publicKey.equals(oldReactionKey));
        console.log('Removed old reaction:', oldReactionKey.toString());
      }
      
      // Add new reaction if provided
      if (newReaction) {
        updated.push(newReaction);
        console.log('Added new reaction:', newReaction.publicKey.toString());
      }
      
      return updated;
    });

    // Update blog counts - only modify counts, don't double-process reactions
    setBlogs(prev => prev.map(blog => {
      if (!blog.publicKey.equals(blogPkey)) return blog;
      
      const updatedBlog = { ...blog };
      const currentLikes = Number(updatedBlog.account.likes || 0);
      const currentDislikes = Number(updatedBlog.account.dislikes || 0);

      // Only update counts based on the operation, not on reaction processing
      if (operation === 'add like') {
        updatedBlog.account.likes = currentLikes + 1;
        console.log(`Like count: ${currentLikes} -> ${currentLikes + 1}`);
      } else if (operation === 'remove like') {
        updatedBlog.account.likes = Math.max(0, currentLikes - 1);
        console.log(`Like count: ${currentLikes} -> ${Math.max(0, currentLikes - 1)}`);
      } else if (operation === 'add dislike') {
        updatedBlog.account.dislikes = currentDislikes + 1;
        console.log(`Dislike count: ${currentDislikes} -> ${currentDislikes + 1}`);
      } else if (operation === 'remove dislike') {
        updatedBlog.account.dislikes = Math.max(0, currentDislikes - 1);
        console.log(`Dislike count: ${currentDislikes} -> ${Math.max(0, currentDislikes - 1)}`);
      }
      
      return updatedBlog;
    }));
  }, []);

  const updateBookmark = useCallback((blogPkey: PublicKey, bookmark: any | null) => {
    if (bookmark) {
      setUserBookmarks(prev => [...prev, bookmark]);
      setBlogs(prev => prev.map(blog => 
        blog.publicKey.equals(blogPkey) 
          ? { ...blog, account: { ...blog.account, bookmarked: (Number(blog.account.bookmarked || 0)) + 1 } }
          : blog
      ));
    } else {
      setUserBookmarks(prev => prev.filter(b => !b.account.relatedBlog.equals(blogPkey)));
      setBlogs(prev => prev.map(blog => 
        blog.publicKey.equals(blogPkey) 
          ? { ...blog, account: { ...blog.account, bookmarked: Math.max(0, (Number(blog.account.bookmarked || 0)) - 1) } }
          : blog
      ));
    }
  }, []);

  const handleBlogUpdate = useCallback((blogPkey: PublicKey, updatedFields: Partial<BlogData['account']>) => {
    setBlogs(prevBlogs => 
      prevBlogs.map(blog => {
        if (blog.publicKey.equals(blogPkey)) {
          return {
            ...blog,
            account: {
              ...blog.account,
              ...updatedFields 
            }
          };
        }
        return blog;
      })
    );
  }, []);

  // Fetch data when wallet changes or blogAddedCount changes
  useEffect(() => {
    if (wallet.publicKey) {
      getData();
    } else {
      // Reset states when wallet disconnects
      setBlogs([]);
      setBlogReactions([]);
      setUserBookmarks([]);
      isLoadingRef.current = false;
      lastFetchRef.current = "";
    }
  }, [wallet.publicKey?.toString(), blogAddedCount]);

  // Reset loading ref when component unmounts
  useEffect(() => {
    return () => {
      isLoadingRef.current = false;
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-3">
      {isLoading && blogs.length === 0 ? (
        <div className="w-full text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="w-full text-center py-8 text-gray-600">
          No blogs found. Create your first blog!
        </div>
      ) : (
        blogs.map((blog) => {
          const bookmark = userBookmarks?.find(
            (bookmark) =>
              bookmark?.account?.relatedBlog.toString() === blog.publicKey.toString()
          );

          const reactions = blogReactions.filter(
            (reaction) =>
              reaction.account.relatedBlog.toString() === blog.publicKey.toString()
          );

          return (
            <BlogCard
              key={blog.publicKey.toString()}
              blogData={blog}
              userBookmarkData={bookmark}
              reactions={reactions}
              userTipsData={userTips}
              onReactionUpdate={updateBlogReaction}
              onBookmarkUpdate={updateBookmark}
              onBlogUpdate={handleBlogUpdate}
            />
          );
        })
      )}
    </div>
  );
};

export default Blog;