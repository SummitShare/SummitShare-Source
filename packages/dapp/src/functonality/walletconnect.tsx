import {
    ThirdwebProvider,
    ConnectWallet,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
    safeWallet,
    lightTheme,
  } from "@thirdweb-dev/react";
  
  export default function App() {
    return (
      <ThirdwebProvider
        activeChain="sepolia"
        clientId="YOUR_CLIENT_ID"
       // locale={en()}

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

          //Placement of Custom images and policy her e
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