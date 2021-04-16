export type Block = {
  id: number;
  size: string;
  number: string;
  timestamp: string;
  nonce: string;
  gaslimit: string;
  hash: string;
}

export type BlockControllerState = {
  blocks: Block[];
};

export type BlockControllerEvent = {
  type: `BlockController:stateChange`;
  payload: [BlockControllerState, Patch[]];
};
