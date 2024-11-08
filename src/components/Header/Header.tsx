import { TonConnectButton } from "@tonconnect/ui-react";
import "./header.scss";

export const Header = () => {
  return (
    <header>
      <span>Ston.Fi Demo Dapp</span>
      <TonConnectButton />
    </header>
  );
};
