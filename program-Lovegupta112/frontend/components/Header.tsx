import { Text } from "./retroui/Text";
import WalletConnect from "./WalletConnect";
const Header=()=>{

   return (
     <div className="flex justify-between p-3">
        <div>
           <Text as="h3">
             Blog Dapp
           </Text>
        </div>
        <div>
            <WalletConnect/>
        </div>
    </div>
   )
}

export default Header;