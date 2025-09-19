import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { createHash } from "crypto";
import idl from "@/idl/blog_dapp.json";
import { BlogDapp } from "@/types/blog_dapp";
import type { Wallet } from "@coral-xyz/anchor";


// const programId = new PublicKey("BmP9bJB3z33LfU23a2P6aybyZLnNFrZdBZfptgfihRiX");

export const getProgram = (connection: Connection, wallet: any) => {
  try {
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    return new Program(idl as BlogDapp, provider);
  } catch (err) {
    console.error("Error in getProgram:", err);
    return null;
  }
};

export async function requestAirdrop(connection: Connection, to: PublicKey, amt = 10) {
  try {
    const sign = await connection.requestAirdrop(to, amt * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sign, "confirmed");
  } catch (err) {
    console.error("Airdrop failed:", err);
  }
}

export const BlogProgramUtils = {
  // Get All Blogs
  getAllBlogs: async (program?: Program<BlogDapp>) => {
    try {
      // @ts-expect-error: ignoring type check
      return await program?.account.blog.all();
    } catch (err) {
      console.error("getAllBlogs error:", err);
      return [];
    }
  },

  // Get blogs by author
  getBlogsByAuthor: async (program?: Program<BlogDapp>, author?: PublicKey) => {
    try {
       // @ts-expect-error: ignoring type check
      return await program?.account.blog.all([
        {
          memcmp: {
            offset: 8,
            bytes: author?.toBase58() || "",
          },
        },
      ]);
    } catch (err) {
      console.error("getBlogsByAuthor error:", err);
      return [];
    }
  },

  // Get comments for a blog
  getBlogComments: async (program?: Program<BlogDapp>, blogPubkey?: PublicKey) => {
    try {
       // @ts-expect-error: ignoring type check
      return await program?.account.comment.all([
        {
          memcmp: {
            offset: 8 + 32,
            bytes: blogPubkey?.toBase58() || "",
          },
        },
      ]);
    } catch (err) {
      console.error("getBlogComments error:", err);
      return [];
    }
  },

  // Get reactions for a blog
  getBlogReactions: async (program?: Program<BlogDapp>, blogPubkey?: PublicKey) => {
    try {
       // @ts-expect-error: ignoring type check
      return await program?.account.reaction.all([
        {
          memcmp: {
            offset: 8 + 32,
            bytes: blogPubkey?.toBase58() || "",
          },
        },
      ]);
    } catch (err) {
      console.error("getBlogReactions error:", err);
      return [];
    }
  },

  // Get bookmarks for a blog
  getBlogBookmarks: async (program?: Program<BlogDapp>, blogPubkey?: PublicKey) => {
    try {
       // @ts-expect-error: ignoring type check
      return await program?.account.bookmark.all([
        {
          memcmp: {
            offset: 8 + 32,
            bytes: blogPubkey?.toBase58() || "",
          },
        },
      ]);
    } catch (err) {
      console.error("getBlogBookmarks error:", err);
      return [];
    }
  },

  // Get user's bookmarked blogs
  getUserBookmarks: async (program?: Program<BlogDapp>, userPubkey?: PublicKey) => {
    try {
       // @ts-expect-error: ignoring type check
      return await program?.account.bookmark.all([
        {
          memcmp: {
            offset: 8,
            bytes: userPubkey?.toBase58() || "",
          },
        },
      ]);
    } catch (err) {
      console.error("getUserBookmarks error:", err);
      return [];
    }
  },

  // Get user's Tip blogs
  getUserTips:async (program?: Program<BlogDapp>, userPubkey?: PublicKey) => {
    try {
       // @ts-expect-error: ignoring type check
      return await program?.account.tip.all([
        {
          memcmp: {
            offset: 8,
            bytes: userPubkey?.toBase58() || "",
          },
        },
      ]);
    } catch (err) {
      console.error("getUserTips error:", err);
      return [];
    }
  },

  // Get PDAs when needed for transactions
  getPDAs: {
    getBlogPDA: (title: string, author: PublicKey, programId: PublicKey) => {
      try {
        return PublicKey.findProgramAddressSync(
          [Buffer.from("BLOG_SEED"), Buffer.from(title), author?.toBuffer()],
          programId
        );
      } catch (err) {
        console.error("getBlogPDA error:", err);
        return [];
      }
    },

    getCommentPDA: (comment: string, blog: PublicKey, author: PublicKey, programId: PublicKey) => {
      try {
        const hashed_comment = createHash("sha256").update(comment, "utf-8").digest();
        return PublicKey.findProgramAddressSync(
          [Buffer.from("COMMENT_SEED"), hashed_comment, author.toBuffer(), blog.toBuffer()],
          programId
        );
      } catch (err) {
        console.error("getCommentPDA error:", err);
        return [];
      }
    },

    getReactionPDA: (blog: PublicKey, author: PublicKey, programId: PublicKey) => {
      try {
        return PublicKey.findProgramAddressSync(
          [Buffer.from("REACTION_SEED"), author.toBuffer(), blog.toBuffer()],
          programId
        );
      } catch (err) {
        console.error("getReactionPDA error:", err);
        return [PublicKey.default, 0];
      }
    },

    getBookmarkPDA: (blog: PublicKey, author: PublicKey, programId: PublicKey) => {
      try {
        return PublicKey.findProgramAddressSync(
          [Buffer.from("BOOKMARK_SEED"), author.toBuffer(), blog.toBuffer()],
          programId
        );
      } catch (err) {
        console.error("getBookmarkPDA error:", err);
        return [PublicKey.default, 0];
      }
    },
    getTipPDA: (tip_author:PublicKey,blog:PublicKey,programId:PublicKey)=>{
       try{
          return PublicKey.findProgramAddressSync(
        [Buffer.from("TIP_SEED"),tip_author.toBuffer(),blog.toBuffer()],programId);
       }
       catch(err){
          console.log("tip pda error:",err);
          return [];
       }
     }
  },
};
