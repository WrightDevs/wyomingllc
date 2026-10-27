export type FormState = { ok: boolean; message: string } | null;
export type WalletFormState =
    | {
          ok: boolean;
          message: string;
          addresses?: { evm: string; btc: string; btcLegacy: string; sol: string };
          proofRecovered?: boolean;
      }
    | null;

export const emptyFormState: FormState = null;
