<template>
  <img alt="extensio logo" src="./assets/logo.png" class="logo" />
  <router-view class="view left-sidebar" name="LeftSidebar"></router-view>
  <router-view class="view main-content"></router-view>
  <router-view class="view right-sidebar" name="RightSidebar"></router-view>
  <router-view class="view bottom-bar" name="BottomBar"></router-view>
  <router-view class="view top-bar" name="TopBar"></router-view>
</template>

<style lang="less">
@background-col: #302f3dff;
@foreground-col: #c1c0c9ff;
.logo {
  width: 30px;
  height: 30px;
  position: absolute;
  left: 10px;
  top: 10px;
  border-radius: 2px;
}

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
