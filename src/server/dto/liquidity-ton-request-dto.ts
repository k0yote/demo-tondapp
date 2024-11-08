import zod from "zod";

export const LiquidityTonRequest = zod.object({
  ptonSendAmount: zod.string(), // assuming a string format for nano values
  ptonMinLpOut: zod.string(),
  jettonAddress: zod.string(),
  jettonSendAmount: zod.string(), // assuming a string format for nano values
  jettonMinLpOut: zod.string(),
});

export type LiquidityTonRequestDto = zod.infer<typeof LiquidityTonRequest>;
