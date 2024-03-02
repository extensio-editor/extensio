<template>
  <div id="titleBar">
    <img alt="extensio logo" src="../assets/logo.png" class="logo" />
    <p>Extensio - {{ project_name }}</p>
    <traffic-lights></traffic-lights>
  </div>
</template>

<script lang="ts">
import trafficLights from "./trafficLights.vue";
export default {
  data() {
    return {
      project_name: "No project opened",
    };
  },
  components: {
    trafficLights,
  },
};
</script>

<style lang="less">
#titleBar {
  height: 35px;
  border-bottom: 2px rgba(25, 25, 25, 0.3) solid;
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
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
