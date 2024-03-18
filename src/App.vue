<template>
  <title-bar></title-bar>
  <router-view class="view left-sidebar" name="LeftSidebar"></router-view>
  <router-view class="view main-content"></router-view>
  <router-view class="view right-sidebar" name="RightSidebar"></router-view>
  <router-view class="view bottom-bar" name="BottomBar"></router-view>
  <router-view class="view top-bar" name="TopBar"></router-view>
  <extensionLoader />
</template>

<script lang="ts">
import titleBar from "./components/titleBar.vue";
import extensionLoader from "./components/extensionLoader.vue";

export default {
  components: {
    titleBar,
    extensionLoader,
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

.dragable {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  user-select: none;
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
