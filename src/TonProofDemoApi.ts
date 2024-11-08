import {
  Account,
  ConnectAdditionalRequest,
  SendTransactionRequest,
  TonProofItemReplySuccess,
} from "@tonconnect/ui-react";
import "./patch-local-storage-for-github-pages";
import { CreateJettonRequestDto } from "./server/dto/create-jetton-request-dto";
import { FaucetJettonRequestDto } from "./server/dto/faucet-jetton-request-dto";
import { LiquidityJettonRequestDto } from "./server/dto/liquidity-jetton-request-dto";
import { LiquidityTonRequestDto } from "./server/dto/liquidity-ton-request-dto";
import { SwapTonToJettonRequestDto } from "./server/dto/swap-ton-to-jetton-request-dto";
import { SwapJettonToJettonRequestDto } from "./server/dto/swap-jetton-to-jetton-request-dto";
import { SwapJettonToTonRequestDto } from "./server/dto/swap-jetton-to-ton-request-dto";

class TonProofDemoApiService {
  private localStorageKey = "demo-api-access-token";

  private host = document.baseURI.replace(/\/$/, "");

  public accessToken: string | null = null;

  public readonly refreshIntervalMs = 9 * 60 * 1000;

  constructor() {
    this.accessToken = localStorage.getItem(this.localStorageKey);

    if (!this.accessToken) {
      this.generatePayload();
    }
  }

  async generatePayload(): Promise<ConnectAdditionalRequest | null> {
    try {
      const response = await (
        await fetch(`${this.host}/api/generate_payload`, {
          method: "POST",
        })
      ).json();
      return { tonProof: response.payload as string };
    } catch {
      return null;
    }
  }

  async checkProof(
    proof: TonProofItemReplySuccess["proof"],
    account: Account
  ): Promise<void> {
    try {
      const reqBody = {
        address: account.address,
        network: account.chain,
        public_key: account.publicKey,
        proof: {
          ...proof,
          state_init: account.walletStateInit,
        },
      };

      const response = await (
        await fetch(`${this.host}/api/check_proof`, {
          method: "POST",
          body: JSON.stringify(reqBody),
        })
      ).json();

      if (response?.token) {
        localStorage.setItem(this.localStorageKey, response.token);
        this.accessToken = response.token;
      }
    } catch (e) {
      console.log("checkProof error:", e);
    }
  }

  async getAccountInfo(account: Account) {
    const response = await (
      await fetch(`${this.host}/api/get_account_info`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })
    ).json();

    return response as {};
  }

  async createJetton(
    jetton: CreateJettonRequestDto
  ): Promise<SendTransactionRequest> {
    return await (
      await fetch(`${this.host}/api/create_jetton`, {
        body: JSON.stringify(jetton),
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    ).json();
  }

  async faucetJetton(
    jetton: FaucetJettonRequestDto
  ): Promise<SendTransactionRequest> {
    return await (
      await fetch(`${this.host}/api/faucet_jetton`, {
        body: JSON.stringify(jetton),
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    ).json();
  }

  async liquidityJetton(
    jetton: LiquidityJettonRequestDto
  ): Promise<SendTransactionRequest> {
    return await (
      await fetch(`${this.host}/api/liquidity_jetton`, {
        body: JSON.stringify(jetton),
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    ).json();
  }

  async liquidityTon(
    jetton: LiquidityTonRequestDto
  ): Promise<SendTransactionRequest> {
    return await (
      await fetch(`${this.host}/api/liquidity_ton`, {
        body: JSON.stringify(jetton),
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    ).json();
  }

  async swapTonToJetton(
    jetton: SwapTonToJettonRequestDto
  ): Promise<SendTransactionRequest> {
    return await (
      await fetch(`${this.host}/api/swap_ton_to_jetton`, {
        body: JSON.stringify(jetton),
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    ).json();
  }

  async swapJettonToJetton(
    jetton: SwapJettonToJettonRequestDto
  ): Promise<SendTransactionRequest> {
    return await (
      await fetch(`${this.host}/api/swap_jetton_to_jetton`, {
        body: JSON.stringify(jetton),
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    ).json();
  }

  async swapJettonToTon(
    jetton: SwapJettonToTonRequestDto
  ): Promise<SendTransactionRequest> {
    return await (
      await fetch(`${this.host}/api/swap_jetton_to_ton`, {
        body: JSON.stringify(jetton),
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    ).json();
  }

  reset() {
    this.accessToken = null;
    localStorage.removeItem(this.localStorageKey);
    this.generatePayload();
  }
}

export const TonProofDemoApi = new TonProofDemoApiService();
