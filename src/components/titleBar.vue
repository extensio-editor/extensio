<template>
  <div id="titleBar">
    <div class="dragable">
      <img alt="extensio logo" src="../assets/logo.png" class="logo" />
      <p>Extensio - {{ project_name }}</p>
    </div>
    <traffic-lights></traffic-lights>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import trafficLights from "./trafficLights.vue";

export default defineComponent({
  props: {
    project_name: {
      type: String,
      default: "No project opened",
    },
  },
  components: {
    trafficLights,
  },
});
</script>

<style lang="less">
#titleBar {
  height: 35px;
  border-bottom: 2px rgba(25, 25, 25, 0.3) solid;
  user-select: none;
  -webkit-user-select: none;
}

.dragable {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  user-select: none;
}

.logo {
  width: 30px;
  height: 30px;
  position: absolute;
  left: 10px;
  top: 10px;
  border-radius: 2px;
}
</style>
