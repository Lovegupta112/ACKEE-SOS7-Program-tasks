use anchor_lang::prelude::*;
use crate::states::*;
use crate::errors::BlogError;


pub fn edit_blog(ctx:Context<EditBlogContext>,updated_content:String)->Result<()>{

    let blog=&mut ctx.accounts.blog;

    msg!("update blog: title,{},content: {},updatedcontentLen:{}",blog.title.to_string(),updated_content.to_string(),updated_content.len());
    
    require!(updated_content.len()<=CONTENT_LENGTH,BlogError::ContentTooLong);
    
    blog.content=updated_content;
    msg!("successfully update blog: title,{}",blog.title.to_string());
    Ok(())
}


#[derive(Accounts)]
pub struct EditBlogContext<'info>{

    #[account(mut)]
    pub blog_author:Signer<'info>,

    #[account(mut,has_one=blog_author,seeds=[BLOG_SEED.as_bytes(),blog.title.as_bytes(),blog_author.key().as_ref()],bump=blog.bump)]
    pub blog:Account<'info,Blog>,
}