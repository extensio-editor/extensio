<template>
  <div
    id="hrTextContainer"
    :class="[dragable ? 'dragable' : '', unselectable ? 'unselectable' : '']"
  >
    <div :style="divStyle" :class="size" class="fakeHr" />
    <span :style="textStyle" id="hrText">{{ text }}</span>
    <div :style="divStyle" :class="size" class="fakeHr" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: String,
    size: {
      type: String,
      default: "medium",
    },
    color: {
      type: String,
      default: "white",
    },
    dragable: {
      type: Boolean,
      default: false,
    },
    unselectable: Boolean,
  },
  data() {
    return {};
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props: any) {
    const divStyle = {
      backgroundColor: props.color,
    };

    const textStyle = {
      color: props.color,
    };

    return {
      divStyle,
      textStyle,
    };
  },
});
</script>

<style lang="less">
.fakeHr {
  transform: translateY(9px);
}

.small {
  height: 1.5px;
  width: calc(25vw / 2);
}

.medium {
  height: 1.5px;
  width: calc(50vw / 2);
}

.large {
  height: 1.5px;
  width: calc(75vw / 2);
}

.humongous {
  height: 1.5px;
  width: calc(50vw / 2);
}

#hrTextContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#hrText {
  margin-left: 10px;
  margin-right: 10px;
}

.dragable {
  -webkit-app-region: drag;
}

.unselectable {
  -webkit-user-select: none;
  user-select: none;
}
</style>
