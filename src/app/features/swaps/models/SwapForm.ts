import BigNumber from 'bignumber.js';
import { BLOCKCHAIN_NAME } from 'src/app/shared/models/blockchain/BLOCKCHAIN_NAME';
import { TokenAmount } from 'src/app/shared/models/tokens/TokenAmount';
import { FormGroup } from '@ngneat/reactive-forms';
import { ISwapForm, ISwapFormInput, ISwapFormOutput } from 'src/app/shared/models/swaps/ISwapForm';

export interface SwapForm extends ISwapForm {
  input: FormGroup<SwapFormInput>;
  output: FormGroup<SwapFormOutput>;
}

export interface SwapFormInput extends ISwapFormInput {
  fromBlockchain: BLOCKCHAIN_NAME;
  toBlockchain: BLOCKCHAIN_NAME;
  fromToken: TokenAmount;
  toToken: TokenAmount;
  fromAmount: BigNumber;
}

export interface SwapFormOutput extends ISwapFormOutput {
  toAmount: BigNumber;
}
