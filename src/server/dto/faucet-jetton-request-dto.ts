import zod from "zod";

export const FaucetJettonRequest = zod.object({
  jettonMasterAddress: zod.string(), // Address of the existing Jetton master
  amount: zod.string().min(1), // Amount to mint in string format to handle large numbers
});

export type FaucetJettonRequestDto = zod.infer<typeof FaucetJettonRequest>;
