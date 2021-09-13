<template>
  <table class="blockchainTable">
    <thead>
      <tr>
        <td width="45%">From</td>
        <td width="35%">To</td>
        <td width="20%">Sum</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="blockchainTable__borderless" colspan="3">
          <div class="blockchainTable__scroll-body">
            <table>
              <tr v-for="node in items" :key="node.id">
                <td width="45%" v-html="node.from.join('<br>')" />
                <td width="35%" v-html="node.to.join('<br>')" />
                <td width="20%">{{node.value}} BTC</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'BlockchainTable',
  props: {
    items: {
      type: Array,
      default: () => ([]),
    },
  },
};
</script>

<style scoped>
.blockchainTable {
  width: 100%;
  height: 100%;
}
.blockchainTable td:not(.blockchainTable__borderless) {
  border: 1px solid black;
  word-wrap:break-word;
}
.blockchainTable td p {
  margin: 0;
}
.blockchainTable__borderless {
  border: none;
}
.blockchainTable__scroll-body {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
}

.blockchainTable__scroll-body table {
  width: 100%;
}
</style>
