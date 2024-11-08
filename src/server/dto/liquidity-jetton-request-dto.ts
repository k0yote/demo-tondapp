import zod from "zod";

// Define the schema for a single transaction parameter set
export const LiquidityJetton = zod.object({
  sendTokenAddress: zod.string(),
  sendAmount: zod.string(), // assuming a string format for nano values
  otherTokenAddress: zod.string(),
  minLpOut: zod.string(),
});

// Define the schema for the array of transaction parameters
export const LiquidityJettonRequest = zod.array(LiquidityJetton);

// Infer TypeScript types from schemas
export type LiquidityJettonRequestDto = zod.infer<
  typeof LiquidityJettonRequest
>;
