//-------------------------------------------------------------------------------
///
/// TASK: Implement the withdraw functionality for the on-chain vault
/// 
/// Requirements:
/// - Verify that the vault is not locked
/// - Verify that the vault has enough balance to withdraw
/// - Transfer lamports from vault to vault authority
/// - Emit a withdraw event after successful transfer
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::WithdrawEvent;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    // TODO: Add required accounts and constraints
    #[account(mut)]
    pub vault_authority: Signer<'info>,
    #[account(mut,
    constraint=!vault.locked @ VaultError::VaultLocked,
    )]
    pub vault:Account<'info,Vault>,
    pub system_program:Program<'info,System>

}

pub fn _withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    // TODO: Implement withdraw functionality
    // todo!()
     let vault=&mut ctx.accounts.vault;
     let vault_authority=&mut ctx.accounts.vault_authority;
     
     require_keys_eq!(vault.vault_authority.key(),vault_authority.key());
     require!(vault.get_lamports()>=amount,VaultError::InsufficientBalance);
     let vault_res=vault.sub_lamports(amount);

     
     match vault_res {
        Ok(_) => {
           let authority_res= vault_authority.add_lamports(amount);
           match authority_res {
               Ok(_)=>{
                    emit!(WithdrawEvent{
                        amount,
                        vault_authority:vault_authority.key(),
                        vault:vault.key()
                    });

                    Ok(())
               }
               Err(e)=>Err(e.into())
           }
        }
        Err(e) => Err(e.into())
     }

}