import React from 'react'
import GenericDialog from '../GenericDialog';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { CommentData } from '@/types/blogTypes';

const Comments = ({
  data,
  currentUser,
  blogPkey,
  onCommentDeleted
}: {
  data: CommentData;
  currentUser: PublicKey;
  blogPkey: PublicKey;
  onCommentDeleted?: (commentKey: PublicKey) => void;
}) => {
  const handleDeleteSuccess = (operation: string) => {
    if (operation === "deleted comment") {
      onCommentDeleted?.(data.publicKey);
    }
  };

  const authorString = data?.account?.commentAuthor?.toString() || '';
  const displayAuthor = authorString.length > 8 
    ? `${authorString.slice(0, 5)}...${authorString.slice(-3)}`
    : authorString;

  return (
    <div className='flex max-w-250 items-start gap-3'>
      <div className='flex gap-4 items-baseline grow-1'>
        <div className='bg-black border w-30 rounded-sm text-white p-1 text-xs text-center flex-shrink-0'>
          {displayAuthor}
        </div>
        <div className='flex-1 break-words'>
          {data?.account?.content}
        </div>
      </div>
      
      {currentUser?.toString() === data?.account?.commentAuthor?.toString() && (
        <div className='flex-shrink-0'>
          <GenericDialog 
            name='Delete' 
            type='comment' 
            author={data?.account?.commentAuthor} 
            blogPkey={blogPkey} 
            itemKey={data?.publicKey}
            onSuccess={handleDeleteSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default Comments;