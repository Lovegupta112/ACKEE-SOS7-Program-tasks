"use client";
import { PublicKey } from "@solana/web3.js";


export enum ReactionType {
    LIKE = 'like',
    DISLIKE = 'disLike'
  }

export type BlogData={
    publicKey: PublicKey;
    account: {
      title: string;
      bookmarked: number;
      likes: number;
      dislikes: number;
      content: string;
      blogAuthor: PublicKey;
    }
  }

export type BlogReactionData={
    publicKey: PublicKey,
    account: {
      reactionAuthor: PublicKey,
      relatedBlog: PublicKey,
      reaction: ReactionType
    }
}

export type CommentData = {
  publicKey: PublicKey,           
  account: {
    commentAuthor: PublicKey,     
    relatedBlog: PublicKey,       
    content: string,             
    createdAt?: number           
    updatedAt?: number           
  }
}

export type UserTipData={
      publicKey: PublicKey;
      account: {
        tipAuthor: PublicKey;
        relatedBlog: PublicKey;
        total_tip:number;
        amount: number;
      };
}