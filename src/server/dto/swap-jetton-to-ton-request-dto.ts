import zod from "zod";

export const SwapJettonToTonRequest = zod.object({
  offerJettonAddress: zod.string(),
  offerAmount: zod.string(),
  minAskAmount: zod.string(),
});

export type SwapJettonToTonRequestDto = zod.infer<
  typeof SwapJettonToTonRequest
>;
