# Project Description

**Deployed Frontend URL:** [earn-with-blogs-solana](https://earn-with-blogs-solana.vercel.app)

**Solana Program ID:** BmP9bJB3z33LfU23a2P6aybyZLnNFrZdBZfptgfihRiX

## Project Overview

### Description
This dApp is a decentralized blogging platform on the Solana blockchain built using Anchor. Users can create blogs, update them, comment, give tips, react (like/dislike), and bookmark blogs. The platform ensures that all operations are securely tied to users’ wallets and prevents unauthorized actions such as updating or deleting other users' content.  

All content is stored on-chain, and Program Derived Addresses (PDAs) are used to uniquely identify blogs, comments, reactions, bookmarks, and tips, ensuring deterministic addresses and preventing duplication.

### Key Features

- Feature 1: **Add Blog** – Users can create a new blog with a title and content.
- Feature 2: **Update Blog** – Blog authors can update the content of their own blogs.
- Feature 3: **Comment on Blog / Remove Comment** – Users can add comments to blogs and delete their own comments.
- Feature 4: **Tip Blog** – Users can send SOL tips to authors for their blogs.
- Feature 5: **React to Blog / Remove Reaction** – Users can like or dislike blogs and undo/remove their reactions.
- Feature 6: **Bookmark Blog / Remove Bookmark** – Users can save blogs to their bookmarks and remove them later.
- Feature 7: **Security** – Only authorized users can perform actions on their own accounts (no deletion of others' content).


  
### How to Use the dApp

1. **Connect Wallet**
2. **Add Blog:** Enter a title and content, then submit. 
3. **Update Blog:** Select your blog and update its content.

4. **Comment on Blog / Remove Comment:**  
   - Users can add only **one comment per blog**.  
   - If you have already commented, you cannot add another; you can only delete your existing comment.
   
5. **Tip Blog:** Click the tip button to open a dialog box and enter the amount in SOL. Note:  
   - You cannot tip your own blog.  
   - If you have already tipped a blog, you cannot tip it again.  
   - Only other users can give tips to a blog.
   
6. **React to Blog / Remove Reaction:**  
   - Users can like or dislike a blog.  
   - If you already liked a blog, you **cannot dislike it directly**; you must first remove your like by clicking the like icon again.  
   - Similarly, if you already disliked a blog, you must remove it before liking.
   
7. **Bookmark Blog / Remove Bookmark:** Users can bookmarks blogs. To remove a bookmark, click the bookmark icon again.

## Program Architecture
The Blog dApp uses a modular architecture with multiple account types and instructions to manage blogs, comments, reactions, bookmarks, and tips. The program leverages **Program Derived Addresses (PDAs)** to uniquely identify each blog, comment, and user interaction, ensuring data integrity and preventing conflicts between different users' actions.


### PDA Usage
The program uses **Program Derived Addresses (PDAs)** to create deterministic accounts for comments, reactions, bookmarks, and tips, ensuring each user’s actions are unique and secure.

**PDAs Used:**
- **Blog PDA:** Derived from seeds `["BLOG_SEED", title, blog_author_pubkey]`  
  Ensures each blog has a unique address based on its title and author, preventing conflicts between blogs.
- **Comment PDA:** Derived from seeds `["COMMENT_SEED", hashed_comment, comment_author_pubkey, blog_pubkey]`  
  Ensures that each user can have only **one comment per blog**. The hashed comment ensures uniqueness and security.
- **Reaction PDA:** Derived from seeds `["REACTION_SEED", reaction_author_pubkey, blog_pubkey]`  
  Ensures that each user can **react only once** to a blog and prevents conflicting reactions.
- **Bookmark PDA:** Derived from seeds `["BOOKMARK_SEED", bookmark_author_pubkey, blog_pubkey]`  
  Ensures that each user can **bookmark a blog only once** and manage it individually.
- **Tip PDA:** Derived from seeds `["TIP_SEED", tip_author_pubkey, blog_pubkey]`  
  Ensures that users can **tip a blog only once**, and prevents the author from tipping their own blog.


### Program Instructions
[TODO: List and describe all the instructions in your Solana program]

**Instructions Implemented:**

- **addBlog:** Creates a new blog account (Blog PDA) with title and content. Only the author can create their own blog.
- **updateBlog:** Updates the content of an existing blog. Only the blog author can perform this action.
- **commentBlog:** Adds a comment to a blog (Comment PDA). A user can comment **only once per blog**.
- **removeCommentBlog:** Removes the user’s comment from a blog.
- **likeBlog:** Adds a like reaction to a blog (Reaction PDA). A user can only have one reaction at a time; must remove existing reaction to switch.
- **dislikeBlog:** Adds a dislike reaction to a blog (Reaction PDA). Same rules as likeBlog apply.
- **removeReactionBlog:** Removes the user’s reaction from a blog.
- **saveBlog:** Bookmarks a blog (Bookmark PDA). A user can bookmark a blog only once.
- **unsaveBlog:** Removes the bookmark from a blog.
- **tipForBlog:** Sends a tip to a blog (Tip PDA). Only other users can tip, and each user can tip only once.

### Account Structure
[TODO: Describe your main account structures and their purposes]

```rust
#[account]
pub struct Blog {
    pub blogAuthor: Pubkey,   // Public key of the blog author
    pub title: String,        // Blog title
    pub content: String,      // Blog content
    pub likes: u64,           // Total number of likes
    pub dislikes: u64,        // Total number of dislikes
    pub bookmarked: u64,      // Total number of bookmarks
    pub bump: u8,             // PDA bump for Blog account
}

#[account]
pub struct Comment {
    pub commentAuthor: Pubkey,   // Public key of the comment author
    pub relatedBlog: Pubkey,     // Associated Blog PDA
    pub content: String,         // Comment content
    pub bump: u8,                // PDA bump for Comment account
}

#[account]
pub struct Reaction {
    pub reactionAuthor: Pubkey,  // Public key of the reaction author
    pub relatedBlog: Pubkey,     // Associated Blog PDA
    pub reaction: ReactionType,  // Enum: like or disLike
    pub bump: u8,                // PDA bump for Reaction account
}

#[account]
pub struct Bookmark {
    pub bookmarkAuthor: Pubkey,  // Public key of the bookmark author
    pub relatedBlog: Pubkey,     // Associated Blog PDA
    pub bump: u8,                // PDA bump for Bookmark account
}

#[account]
pub struct Tip {
    pub tipAuthor: Pubkey,       // Public key of the tip sender
    pub relatedBlog: Pubkey,     // Associated Blog PDA
    pub totalTip: u64,           // Amount tipped
    pub bump: u8,                // PDA bump for Tip account
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ReactionType {
    Like,
    DisLike,
}
```

## Testing

### Test Coverage
Comprehensive test suite covering all instructions of the BlogDapp program. It includes both **happy path** (successful operations) and **unhappy path** (error conditions) tests to ensure program correctness and security.


**Happy Path Tests:**
- **Add Blog**
  - Initialize blog with valid title and content.
  - Initialize blog with empty content.
  - Initialize blog with Unicode characters (emojis).
  - Initialize blog with a different title and same author.
  - Initialize blog with same title and different author.

- **Update Blog**
  - Blog author can update their own blog content.

- **Save/Bookmark Blog**
  - Blog authors can bookmark their own blogs.
  - Users can bookmark others’ blogs.

- **Add Tip**
  - Users can tip a blog (excluding the blog author).

- **Add Comment**
  - Users can add comments with valid content length.
  - Multiple users can comment on the same blog.

- **Add Reaction**
  - Users can like or dislike their own blog.
  - Users can like or dislike others’ blogs.

- **Remove Operations**
  - Users can remove their own bookmarks, comments, and reactions.


**Unhappy Path Tests:**
- **Blog Operations**
  - Fail when blog title exceeds 30 bytes.
  - Fail when blog content exceeds 800 bytes.
  - Fail when initializing a duplicate blog (same author + title).
  - Fail when a non-author tries to update someone else's blog.

- **Bookmark Operations**
  - Fail when trying to bookmark the same blog twice.
  - Fail when trying to remove others’ bookmarks.
  - Fail when trying to remove a non-existent bookmark.

- **Tip Operations**
  - Fail when blog author tries to tip their own blog.
  - Fail when trying to tip a non-existent blog.

- **Comment Operations**
  - Fail when comment exceeds 400 bytes.
  - Fail when creating duplicate comments with same content.
  - Fail when commenting on a non-existent blog.
  - Fail when removing others’ comments.
  - Fail when removing a non-existent comment.

- **Reaction Operations**
  - Fail when adding a reaction twice for the same blog.
  - Fail when liking/disliking a non-existent blog.
  - Fail when removing others’ reactions.
  - Fail when removing a non-existent reaction.


### Running Tests
```bash
# Commands to run your tests
cd anchor_project/blog-dapp
yarn install    # install dependencies
anchor test     # run tests
```

### Additional Notes for Evaluators


This was my first end-to-end Solana dApp. The main challenges were understanding **PDAs**, ensuring correct **account ownership checks**, and handling async transaction confirmations. On the frontend, I ran into **multiple RPC calls** due to limited React optimization skills, but all features work as per the **acceptance criteria**.  

What I learned:  
- How to derive and use **Program Derived Addresses (PDAs)** effectively.  
- Implementing **ownership validation** and secure account constraints.  
- Writing both **happy/unhappy path tests** for reliability.  
- The importance of linking on-chain logic smoothly with the **frontend UI**.  

Overall, this project gave me solid hands-on experience in building a complete Solana dApp from program to UI.