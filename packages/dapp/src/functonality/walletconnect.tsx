import {ThirdwebProvider, ConnectWallet, metamaskWallet, coinbaseWallet, walletConnect, safeWallet, lightTheme, useAddress,} from "@thirdweb-dev/react";
import React, {useEffect, useState} from 'react';
import axios from 'axios'; 

  export default function WalletConnectNav () {

    //Logging of connected useraddress
    const userAddress = useAddress();
    const [connectedAddress, setConnectedAddress] = useState('');

    const sendApiRequest = async (address: string,user_id: string) => {
      try {
        const response = await axios.post('YOUR_API_ENDPOINT', { address });
        console.log('API Response:', response.data);
        // Handle the response as needed
      } catch (error) {
        console.error('API Request Failed:', error);
        // Handle the error as needed
      }
    };

     // Effect to capture the user's public address when connected
     useEffect(() => {
      if (userAddress) {
          setConnectedAddress(userAddress);
          console.log("Connected Wallet Address:", userAddress);
          const user_id=""
          sendApiRequest(userAddress, user_id);
      }
  }, [userAddress]);

    return (
      <ThirdwebProvider
        activeChain="mumbai"
        clientId="YOUR_CLIENT_ID"
      //  locale={en()}

// Wallets our platfrom allows to connect
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet({ recommended: true }),
          walletConnect(),
          safeWallet({
  
            recommended: true,
            personalWallets: [
              metamaskWallet(),
              coinbaseWallet({ recommended: true }),
              walletConnect(),
            ],
          }),
        ]}
      >
        
        <ConnectWallet
          theme={lightTheme({
            colors: {
              accentText: "#FF7324",
              accentButtonBg: "#FF7324",
              primaryText: "#1c0f08",
              primaryButtonBg: "#FF7324",
            },
          })}

          modalSize={"wide"}
          welcomeScreen={{
            title:
              "Begin your Journey with SummitShare!",
          }}

          //Placement of Custom images and policy here
          modalTitleIconUrl={
            "https://Summitshareicongoeshere.com"
          }
          termsOfServiceUrl={
            "https://termsofservicegoeshere.com"
          }
          privacyPolicyUrl={
            "https://privacypolicygoeshere.com"
          }
        />
      </ThirdwebProvider>
    );
  }