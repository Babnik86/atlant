<template>
  <div class="blockchain">
    <button @click="start()">Start</button>
    <button @click="stop()">Stop</button>
    <button @click="reset()">Reset</button>
    <h2>Сумма: {{ totalBalance }} BTC</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <td>From</td>
            <td>To</td>
            <td>Sum</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="node in txNodes" :key="node.id">
            <td v-html="node.from.join('<br>')"></td>
            <td v-html="node.to.join('<br>')">/td>
            <td>{{node.value}} BTC</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const websocket = new WebSocket('wss://ws.blockchain.info/inv');
export default {
  name: 'BlockchainPage',
  data() {
    return {
      txNodes: [],
      totalBalance: 0,
    };
  },
  methods: {
    start() {
      websocket.send(JSON.stringify({
        op: 'unconfirmed_sub',
      }));
    },
    stop() {
      websocket.send(JSON.stringify({
        op: 'unconfirmed_unsub',
      }));
    },
    reset() {
      this.stop();
      this.txNodes = [];
      this.totalBalance = 0;
    },
    balanceIncrement(btc) {
      this.totalBalance += btc;
    },
    prepareData(msgData) {
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
    },
  },
  created() {
    websocket.onmessage = (event) => {
      const msgData = JSON.parse(event.data);
      if (msgData.op === 'utx') {
        const newTx = this.prepareData(msgData);
        this.txNodes.push(newTx);
        this.balanceIncrement(newTx.value);
        if (this.txNodes.length > 10) {
          this.txNodes.shift();
        }
      }
    };
  },
};
</script>

<style scoped>
td {
  border: 1px solid black;
  word-wrap:break-word;
}
td p {
  margin: 0;
}
.table-wrapper {
  height: 100%;
  overflow-y: scroll;
  margin: 0 20px 20px 20px;
}
</style>
