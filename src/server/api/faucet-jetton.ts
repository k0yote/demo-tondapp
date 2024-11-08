import { storeJettonMintMessage } from "@ton-community/assets-sdk";
import { beginCell, toNano } from "@ton/core";
import { Address } from "@ton/ton";
import { CHAIN } from "@tonconnect/sdk";
import { HttpResponseResolver } from "msw";
import { FaucetJettonRequest } from "../dto/faucet-jetton-request-dto";
import { badRequest, ok, unauthorized } from "../utils/http-utils";
import { decodeAuthToken, verifyToken } from "../utils/jwt";

const VALID_UNTIL = 1000 * 60 * 5; // 5 minutes

/**
 * Checks the proof and returns an access token.
 *
 * POST /api/faucet_jetton
 */
export const faucetJetton: HttpResponseResolver = async ({ request }) => {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token || !(await verifyToken(token))) {
      return unauthorized({ error: "Unauthorized" });
    }

    const payload = decodeAuthToken(token);
    if (!payload?.address || !payload?.network) {
      return unauthorized({ error: "Invalid token" });
    }

    const body = FaucetJettonRequest.parse(await request.json());
    // Specify the time until the message is valid
    const validUntil = Math.round((Date.now() + VALID_UNTIL) / 1000);
    const senderAddress = Address.parse(payload.address);
    // who will receive the jetton
    const receiverAddress = Address.parse(payload.address);

    // Amount of TON to send with the message (faucet amount)
    const amount = toNano("0.06").toString();
    const walletForwardValue = toNano("0.05");
    const jettonMasterAddress = Address.parse(body.jettonMasterAddress);
    const amountToMint = BigInt(body.amount);

    // Prepare payload for the jetton mint message
    const payloadBase64 = beginCell()
      .store(
        storeJettonMintMessage({
          queryId: 0n,
          amount: amountToMint,
          from: jettonMasterAddress,
          to: receiverAddress,
          responseAddress: senderAddress,
          forwardPayload: null,
          forwardTonAmount: 1n,
          walletForwardValue: walletForwardValue,
        })
      )
      .endCell()
      .toBoc()
      .toString("base64");

    return ok({
      validUntil: validUntil,
      from: senderAddress.toRawString(),
      messages: [
        {
          address: jettonMasterAddress.toString({
            urlSafe: true,
            bounceable: true,
            testOnly: payload.network === CHAIN.TESTNET,
          }),
          amount: amount,
          payload: payloadBase64,
        },
      ],
    });
  } catch (e) {
    if (e instanceof Error) {
      return badRequest({ error: "Invalid request", trace: e.message });
    }
    return badRequest({ error: "Invalid request", trace: e });
  }
};
