import zod from "zod";

export const SwapTonToJettonRequest = zod.object({
  offerAmount: zod.string(),
  askJettonAddress: zod.string(),
  minAskAmount: zod.string(),
});

export type SwapTonToJettonRequestDto = zod.infer<
  typeof SwapTonToJettonRequest
>;
