<template>
  <div style="width: 100%; height: 100%">
    <div v-if="!loading" class="widgets-container" ref="widgetsContainer">
      <widget-item
        v-for="widget in widgets"
        :params="widget"
        :key="widget.id"
        :gridX="gridX"
        :gridY="gridY"
        @activated="changePriority"
        @resized="changeWidget"
        @remove="removeWidget"
      />
    </div>
    <div class="buttons-container">
      <button @click="restoreWidget" :disabled="disableRestore">Restore widget from bin</button>
      <button @click="sortCurrentWidgets()">Sort widget</button>
      <button @click="sortCurrentWidgets(mockWidgets)">ReInit widgets</button>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es';
import WidgetItem from '@/components/widgets/WidgetItem.vue';

export default {
  name: 'WidgetsContainer',
  components: {
    WidgetItem,
  },
  props: {
    gridX: {
      type: Number,
      default: 10,
    },
    gridY: {
      type: Number,
      default: 10,
    },
    defaultWidgetParams: {
      type: Object,
      default() {
        return {
          width: 300,
          height: 100,
          active: false,
        };
      },
    },
  },
  data() {
    return {
      mockWidgets: [
        {
          id: '0',
          width: 300,
          height: 100,
          top: 0,
          left: 0,
          active: false,
          priority: 1,
          content: {
            title: 'Title 1',
          },
        },
        {
          id: '1',
          width: 300,
          height: 100,
          top: 0,
          left: 310,
          active: false,
          priority: 2,
          content: {
            title: 'Title 2',
          },
        },
        {
          id: '2',
          width: 300,
          height: 100,
          top: 0,
          left: 620,
          active: false,
          priority: 3,
          content: {
            title: 'Title 3',
          },
        },
        {
          id: '3',
          width: 300,
          height: 100,
          top: 210,
          left: 0,
          active: false,
          priority: 4,
          content: {
            title: 'Title 4',
          },
        },
        {
          id: '4',
          width: 300,
          height: 100,
          top: 210,
          left: 310,
          active: false,
          priority: 5,
          content: {
            title: 'Title 5',
          },
        },
      ],
      loading: false,
      removedWidgets: [],
      widgets: [],
    };
  },

  computed: {
    disableRestore() {
      return !this.removedWidgets.length;
    },
  },
  mounted() {
    try {
      this.widgets = this.restoreWidgetsFromLocalStorage();
    } catch (e) {
      this.sortCurrentWidgets(this.mockWidgets);
    }
  },
  methods: {
    sortWidgets(widgets) {
      this.loading = true;
      const localWidgets = cloneDeep(widgets);
      let currentTop = 0;
      let currentLeft = 0;
      localWidgets.map((w) => {
        if ((currentLeft + w.width) <= +this.$refs.widgetsContainer.clientWidth) {
          w.top = currentTop < 0 ? 0 : currentTop;
          w.left = currentLeft < 0 ? 0 : currentLeft;
          currentLeft += w.width + this.gridX;
        } else {
          currentTop += w.height + this.gridY;
          currentLeft = 0;
          w.top = currentTop < 0 ? 0 : currentTop;
          w.left = currentLeft < 0 ? 0 : currentLeft;
        }
        w.active = false;
        return w;
      });
      setTimeout(() => {
        this.loading = false;
      }, 0);
      return localWidgets;
    },
    sortCurrentWidgets(widgets) {
      this.widgets = this.sortWidgets(widgets || this.widgets);
      this.saveWidgetsToLocalStorage();
    },
    changePriority(widgetId) {
      const activeWidget = cloneDeep(this.widgets.filter((w) => w.id === widgetId)[0]);
      this.widgets = this.widgets.map((w) => {
        w.active = false;
        if (w.id === widgetId) {
          w.priority = this.widgets.length;
          w.active = true;
        } else if (w.priority >= activeWidget.priority) {
          w.priority -= 1;
        }
        return w;
      });
      this.saveWidgetsToLocalStorage();
    },
    changeWidget(widgetId, rect) {
      if (!this.loading) {
        const activeWidgetIndex = this.widgets.findIndex((w) => w.id === widgetId);
        Object.assign(this.widgets[activeWidgetIndex], rect);
        this.saveWidgetsToLocalStorage();
      }
    },
    removeWidget(widgetId) {
      const activeWidgetIndex = this.widgets.findIndex((w) => w.id === widgetId);
      this.removedWidgets.push(this.widgets.splice(activeWidgetIndex, 1));
      this.saveWidgetsToLocalStorage();
    },
    restoreWidget() {
      const restoredWidget = this.removedWidgets.pop()[0];
      this.widgets.push(this.widgetToDefaultParams(restoredWidget));
      this.saveWidgetsToLocalStorage();
    },
    widgetToDefaultParams(widget) {
      const widgetsContainer = {
        height: +this.$refs.widgetsContainer.clientHeight,
        width: +this.$refs.widgetsContainer.clientWidth,
      };
      widget.left = widgetsContainer.width / 2 - 150;
      widget.top = widgetsContainer.height / 2 - 50;
      widget.width = 300;
      widget.height = 100;
      widget.active = false;
      return widget;
    },
    saveWidgetsToLocalStorage() {
      localStorage.setItem('widgets', JSON.stringify(this.widgets));
    },
    restoreWidgetsFromLocalStorage() {
      if (localStorage.getItem('widgets') === null) {
        throw new Error();
      }
      return JSON.parse(localStorage.getItem('widgets'));
    },
  },
};
</script>

<style>
  .widgets-container {
    position:relative;
    width: 100%;
    height: calc(100% - 150px);
  }
  .buttons-container {
    width: 100%;
    height: 100px;
  }
</style>
