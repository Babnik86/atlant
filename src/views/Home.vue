<template>
  <div style="width: 100%; height: 100%">
    <widgets-container :gridX="10" :gridY="10" :defaultWidgetParams="defaultWidgetParams"/>
  </div>

</template>

<script>
import WidgetsContainer from '@/components/widgets/WidgetsContainer.vue';

export default {
  name: 'HomePage',
  components: { WidgetsContainer },
  data() {
    return {
      defaultWidgetParams: {
        width: 300,
        height: 100,
        active: false,
      },
    };
  },
};
</script>
