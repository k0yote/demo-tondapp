import { toNano } from "@ton/core";
import { TonClient, Address } from "@ton/ton";
import { CHAIN } from "@tonconnect/sdk";
import { DEX, pTON } from "@ston-fi/sdk";
import { HttpResponseResolver } from "msw";
import { SwapTonToJettonRequest } from "../dto/swap-ton-to-jetton-request-dto";
import { badRequest, ok, unauthorized } from "../utils/http-utils";
import { decodeAuthToken, verifyToken } from "../utils/jwt";

const VALID_UNTIL = 1000 * 60 * 5; // 5 minutes
const getNextQueryId = () => Date.now();

const client = new TonClient({
  endpoint: import.meta.env.VITE_TONCLIENT_ENDPOINT,
  apiKey: import.meta.env.VITE_TONCLIENT_API_KEY,
});
const router = client.open(
  new DEX.v1.Router(import.meta.env.VITE_STONEFI_ROUTER_ADDRESS)
);

/**
 * Checks the proof and returns an access token.
 *
 * POST /api/swap_ton_to_jetton
 */
export const swapTonToJetton: HttpResponseResolver = async ({ request }) => {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token || !(await verifyToken(token))) {
      return unauthorized({ error: "Unauthorized" });
    }

    const payload = decodeAuthToken(token);
    if (!payload?.address || !payload?.network) {
      return unauthorized({ error: "Invalid token" });
    }

    // specify the time until the message is valid
    const validUntil = Math.round((Date.now() + VALID_UNTIL) / 1000);

    const body = SwapTonToJettonRequest.parse(await request.json());
    // forward value for the message to the wallet
    const walletForwardValue = toNano("0.185");

    // who send the jetton create message
    const senderAddress = Address.parse(payload.address);

    // swap 1 TON to STON but not less than 1 nano STON
    const txParams = await router.getSwapTonToJettonTxParams({
      userWalletAddress: senderAddress, // ! replace with your address
      proxyTon: new pTON.v1(),
      offerAmount: toNano(body.offerAmount),
      askJettonAddress: body.askJettonAddress, // STON
      minAskAmount: body.minAskAmount,
      queryId: getNextQueryId(),
    });

    const totalAmount = txParams.value + walletForwardValue;

    return ok({
      validUntil: validUntil,
      from: senderAddress.toRawString(),
      messages: [
        {
          address: txParams.to.toString(),
          amount: totalAmount.toString(),
          payload: txParams.body?.toBoc().toString("base64"),
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
