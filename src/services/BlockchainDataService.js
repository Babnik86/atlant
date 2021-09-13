class BlockchainDataService {
  constructor(url = 'wss://ws.blockchain.info/inv') {
    this.socket = new WebSocket(url);
    this.onDataChange = null;

    this.initEventHandler();
  }

  start() {
    this.socket.send(JSON.stringify({
      op: 'unconfirmed_sub',
    }));
  }

  stop() {
    this.socket.send(JSON.stringify({
      op: 'unconfirmed_unsub',
    }));
  }

  prepareData = (msgData) => {
    const txHash = msgData.x.hash;
    const { out, inputs } = msgData.x;
    let totalTxValue = 0;
    const outIDs = [];
    const inputIDs = [];
    for (let j = 0; j < out.length; j += 1) {
      const output = out[j];
      outIDs.push(out[j].addr);
      totalTxValue += output.value;
    }
    for (let j = 0; j < inputs.length; j += 1) {
      inputIDs.push(inputs[j].prev_out.addr);
    }
    totalTxValue /= 100000000;
    return {
      id: txHash, value: totalTxValue, to: inputIDs, from: outIDs,
    };
  }

  initEventHandler() {
    this.socket.onmessage = (event) => {
      const msgData = JSON.parse(event.data);
      if (msgData.op === 'utx' && this.onDataChange) {
        this.onDataChange(this.prepareData(msgData));
      }
    };
  }
}

export default BlockchainDataService;
