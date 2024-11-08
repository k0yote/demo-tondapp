import { toNano } from "@ton/core";
import { TonClient, Address } from "@ton/ton";
import { CHAIN } from "@tonconnect/sdk";
import { DEX, pTON } from "@ston-fi/sdk";
import { HttpResponseResolver } from "msw";
import { LiquidityJettonRequest } from "../dto/liquidity-jetton-request-dto";
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
 * POST /api/liquidity_jetton
 */
export const liquidityJetton: HttpResponseResolver = async ({ request }) => {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token || !(await verifyToken(token))) {
      return unauthorized({ error: "Unauthorized" });
    }

    const payload = decodeAuthToken(token);
    if (!payload?.address || !payload?.network) {
      return unauthorized({ error: "Invalid token" });
    }

    const body = LiquidityJettonRequest.parse(await request.json());

    // specify the time until the message is valid
    const validUntil = Math.round((Date.now() + VALID_UNTIL) / 1000);

    // amount of TON to send with the message
    const amount = toNano("0.06").toString();
    // forward value for the message to the wallet
    const walletForwardValue = toNano("0.05");

    // who send the jetton create message
    const senderAddress = Address.parse(payload.address);

    const txsParams = await Promise.all([
      // deposit amojnt STON to the STON/GEMSTON pool and get at least 1 nano LP token
      router.getProvideLiquidityJettonTxParams({
        userWalletAddress: senderAddress,
        sendTokenAddress: body[0].sendTokenAddress,
        sendAmount: toNano(body[0].sendAmount),
        otherTokenAddress: body[0].otherTokenAddress,
        minLpOut: body[0].minLpOut,
        queryId: getNextQueryId(),
      }),
      // deposit 2 GEMSTON to the STON/GEMSTON pool and get at least 1 nano LP token
      router.getProvideLiquidityJettonTxParams({
        userWalletAddress: senderAddress,
        sendTokenAddress: body[1].sendTokenAddress,
        sendAmount: toNano(body[1].sendAmount),
        otherTokenAddress: body[1].otherTokenAddress,
        minLpOut: body[1].minLpOut,
        queryId: getNextQueryId(),
      }),
    ]);

    return ok({
      validUntil: validUntil,
      from: senderAddress.toRawString(),
      messages: [
        {
          address: txsParams[0].to.toString(),
          amount: txsParams[0].value.toString(),
          payload: txsParams[0].body?.toBoc().toString("base64"),
        },
        {
          address: txsParams[1].to.toString(),
          amount: txsParams[1].value.toString(),
          payload: txsParams[1].body?.toBoc().toString("base64"),
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
