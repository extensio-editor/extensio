<template>
  <title-bar :project_name="currentProject"></title-bar>
  <router-view class="view left-sidebar" name="LeftSidebar"></router-view>
  <router-view class="view main-content"></router-view>
  <router-view class="view right-sidebar" name="RightSidebar"></router-view>
  <router-view class="view bottom-bar" name="BottomBar"></router-view>
  <router-view class="view top-bar" name="TopBar"></router-view>
  <extensionLoader />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import titleBar from "./components/titleBar.vue";
import extensionLoader from "./components/extensionLoader.vue";

export default defineComponent({
  components: {
    titleBar,
    extensionLoader,
  },
  data() {
    return {
      currentProject: undefined,
    };
  },
  mounted() {
    (async () => {
      const data = await fetch("http://localhost:8081/project/get");
      const project = await data.json();
      this.currentProject = project.name;
    })();
  },
});
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
