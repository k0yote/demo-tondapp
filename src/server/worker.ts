import { http } from "msw";
import { setupWorker } from "msw/browser";
import { checkProof } from "./api/check-proof";
import { createJetton } from "./api/create-jetton";
import { faucetJetton } from "./api/faucet-jetton";
import { generatePayload } from "./api/generate-payload";
import { getAccountInfo } from "./api/get-account-info";
import { healthz } from "./api/healthz";
import { liquidityJetton } from "./api/liquidity-jetton";
import { liquidityTon } from "./api/liquidity-ton";
import { swapTonToJetton } from "./api/swap-ton-to-jetton";
import { swapJettonToJetton } from "./api/swap-jetton-to-jetton";
import { swapJettonToTon } from "./api/swap-jetton-to-ton";

const baseUrl = document.baseURI.replace(/\/$/, "");

export const worker = setupWorker(
  http.get(`${baseUrl}/api/healthz`, healthz),
  http.post(`${baseUrl}/api/generate_payload`, generatePayload),
  http.post(`${baseUrl}/api/check_proof`, checkProof),
  http.get(`${baseUrl}/api/get_account_info`, getAccountInfo),
  http.post(`${baseUrl}/api/create_jetton`, createJetton),
  http.post(`${baseUrl}/api/faucet_jetton`, faucetJetton),
  http.post(`${baseUrl}/api/liquidity_jetton`, liquidityJetton),
  http.post(`${baseUrl}/api/liquidity_ton`, liquidityTon),
  http.post(`${baseUrl}/api/swap_ton_to_jetton`, swapTonToJetton),
  http.post(`${baseUrl}/api/swap_jetton_to_jetton`, swapJettonToJetton),
  http.post(`${baseUrl}/api/swap_jetton_to_ton`, swapJettonToTon)
);
