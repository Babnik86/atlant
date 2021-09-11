<template>
  <div>
    <VueDragResize
      :isActive="params.active"
      :w="params.width"
      :h="params.height"
      :y="params.top"
      :x="params.left"
      @resizestop="widgetResized"
      @dragstop="widgetResized"
      :z="params.priority"
      :snapToGrid="true"
      :gridX="gridX"
      :gridY="gridY"
      @activated="widgetClicked"
    >
      <div class="content-container-header">
        <b>{{ params.content.title }}</b>
        <button @click="widgetRemove()">&#128465;</button>
      </div>
      <div>
      </div>
    </VueDragResize>
  </div>
</template>

<script>
import VueDragResize from 'vue-drag-resize';

export default {
  name: 'DashboardWidget',
  components: {
    VueDragResize,
  },
  props: {
    params: Object,
    gridX: {
      type: Number,
      default: 10,
    },
    gridY: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {};
  },
  methods: {
    widgetClicked() {
      this.$emit('activated', this.params.id);
    },
    widgetRemove() {
      console.log('widgetRemove');
      this.$emit('remove', this.params.id);
    },
    widgetResized(newRect) {
      this.$emit('resized', this.params.id, newRect);
    },
  },
};
</script>

<style>
  .vdr {
    background-color: white;
    border: 1px solid black;
  }
  .vdr .content-container-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    background: grey;
    padding: 10px 20px;
    box-sizing: border-box;
  }
</style>
