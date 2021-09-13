<template>
  <div class="blockchain">
    <button @click="start()">Start</button>
    <button @click="stop()">Stop</button>
    <button @click="reset()">Reset</button>
    <h2>Сумма: {{ totalBalance }} BTC</h2>
    <div class="table-wrapper">
      <BlockchainTable :items="txNodes" />
    </div>
  </div>
</template>

<script>
import BlockchainTable from '@/components/BlockchainTable.vue';
import BlockchainDataService from '../services/BlockchainDataService';

const blockchainService = new BlockchainDataService();

export default {
  name: 'BlockchainPage',
  components: { BlockchainTable },
  data() {
    return {
      txNodes: [],
      totalBalance: 0,
    };
  },
  created() {
    blockchainService.onDataChange = (data) => {
      this.txNodes.push(data);
      this.balanceIncrement(data.value);
      if (this.txNodes.length > 10) {
        this.txNodes = this.txNodes.slice(1);
      }
    };
  },
  beforeDestroy() {
    this.reset();
  },
  methods: {
    start() {
      blockchainService.start();
    },
    stop() {
      blockchainService.stop();
    },
    reset() {
      this.stop();
      this.txNodes = [];
      this.totalBalance = 0;
    },
    balanceIncrement(btc) {
      this.totalBalance += btc;
    },
  },
};
</script>

<style scoped>
.table-wrapper {
  height: 50vh;
  overflow-y: scroll;
  margin: 20px 0;
  box-sizing: border-box;
}
</style>
