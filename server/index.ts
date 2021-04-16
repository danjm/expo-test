import type { Draft, Patch } from 'immer';
import { BaseController, getAnonymizedState, getPersistentState, ControllerMessenger } from '@metamask/controllers';
import { Block, BlockControllerState, BlockControllerEvent } from '.types.ts';
import fetch from 'node-fetch';

const FETCH_URL = 'https://mainnet.infura.io/v3/9d1b5930f82f479d89cf87310d59b51b';

async function getBlock() {
  let result = await fetch(FETCH_URL, { method: 'post', body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
    params: ['latest', false],
    id: 1,
  }), headers: { 'Content-Type': 'application/json'}}).then(r => r.json());

  const newBlock: Block = {
    id: result.result.id,
    size: result.result.size,
    number: result.result.number,
    timestamp: result.result.timestamp,
    nonce: result.result.nonce,
    gaslimit: result.result.gaslimit,
    hash: result.result.hash,
  };
  newBlock.number = result.result.number;
  newBlock.hash = result.result.hash;
  newBlock.gaslimit = result.result.gasLimit;
  newBlock.nonce = result.result.nonce;
  newBlock.size = result.result.size;
  newBlock.timestamp = result.result.timestamp;

  return newBlock;
};

const BlockControllerStateMetadata = {
  count: {
    persist: true,
    anonymous: true,
  },
};

class BlockController extends BaseController<'BlockController', BlockControllerState> {
  update(callback: (state: Draft<BlockControllerState>) => void | BlockControllerState) {
    super.update(callback);
  }

  destroy() {
    super.destroy();
  }

  initializePolling = () => {
    setInterval(async () => {
      const newBlock = await getBlock();
      this.update(draft => {
        draft.blocks.push(newBlock)
      });
    }, 20000);
  }
}
const blockControllerMessenger = new ControllerMessenger<never, BlockControllerEvent>();
const blockController = new BlockController({
  messenger: blockControllerMessenger,
  name: 'BlockController',
  state: { blocks: [] },
  metadata: BlockControllerStateMetadata,
});

blockController.initializePolling();


export { blockController, blockControllerMessenger };