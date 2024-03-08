<template>
  <div id="trafficLights">
    <div
      @click="trafficLightAction('toggleFullscreen')"
      class="trafficLight"
      id="GreenLight"
    >
      o
    </div>
    <div
      @click="trafficLightAction('minimize')"
      class="trafficLight"
      id="OrangeLight"
    >
      o
    </div>
    <div
      @click="trafficLightAction('close')"
      class="trafficLight"
      id="RedLight"
    >
      o
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
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
});
</script>

<style lang="less">
#trafficLights {
  z-index: 10;
  position: absolute;
  right: 10px;
  top: calc(35px / 2);
  -webkit-app-region: no-drag;
}

.trafficLight {
  cursor: pointer;
  display: inline-block;
  z-index: 2147483647;
  margin: 5px;
  margin-top: 0;
  margin-bottom: 0;
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
