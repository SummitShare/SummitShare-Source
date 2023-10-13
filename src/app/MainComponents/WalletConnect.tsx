import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
  lightTheme,
} from "@thirdweb-dev/react";

export default function Wallet() {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet({ recommended: true }),
        walletConnect(),
        localWallet(),
        embeddedWallet(),
      ]}
    >
      <ConnectWallet
        theme={lightTheme({
          colors: {
            accentText: "#e66f00",
            accentButtonBg: "#e66f00",
            borderColor: "#e66f00",
            separatorLine: "#e66f00",
            primaryButtonBg: "#e66f00",
          },
        })}
        modalSize={"wide"}
        welcomeScreen={{
          title: "The beginning of your journey with SummitShare!",
        }}
        modalTitleIconUrl={""}
      />
    </ThirdwebProvider>
  );
}
