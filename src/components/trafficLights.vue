<template>
  <div id="trafficLights">
    <div
      class="trafficLight"
      id="GreenLight"
      @click="trafficLightAction('toggleFullscreen')"
    >
      o
    </div>
    <div
      class="trafficLight"
      id="OrangeLight"
      @click="trafficLightAction('minimize')"
    >
      o
    </div>
    <div
      class="trafficLight"
      id="RedLight"
      @click="trafficLightAction('close')"
    >
      o
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "traffic-lights",
  methods: {
    trafficLightAction(action: string) {
      try {
        fetch(`http://localhost:8081/window/trafficLights/${action}`);
      } catch (error) {
        console.log("failed to do traffic light action!!!");
        console.log(error);
      }
    },
  },
};
</script>

<style lang="less">
#trafficLights {
  z-index: 0;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.trafficLight {
  display: inline-block;
  margin: 5px;
  width: 12px;
  height: 12px;
  line-height: 12px;
  border-radius: 50%;
}

#RedLight {
  background-color: red;
  color: red;
}
#OrangeLight {
  background-color: orange;
  color: orange;
}
#GreenLight {
  background-color: green;
  color: green;
}
</style>
