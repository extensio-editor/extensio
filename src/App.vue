<template>
  <title-bar></title-bar>
  <router-view class="view left-sidebar" name="LeftSidebar"></router-view>
  <router-view class="view main-content"></router-view>
  <router-view class="view right-sidebar" name="RightSidebar"></router-view>
  <router-view class="view bottom-bar" name="BottomBar"></router-view>
  <router-view class="view top-bar" name="TopBar"></router-view>
</template>

<script lang="ts">
import titleBar from "./components/titleBar.vue";

export default {
  components: {
    titleBar,
  },
};
</script>

<style lang="less">
@background-col: #302f3dff;
@foreground-col: #c1c0c9ff;

body {
  background-color: @background-col;
  color: @foreground-col;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @foreground-col;
  background-color: @background-col;
}
</style>
