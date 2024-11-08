import zod from "zod";

export const SwapJettonToJettonRequest = zod.object({
  offerJettonAddress: zod.string(),
  offerAmount: zod.string(),
  askJettonAddress: zod.string(),
  minAskAmount: zod.string(),
});

export type SwapJettonToJettonRequestDto = zod.infer<
  typeof SwapJettonToJettonRequest
>;
