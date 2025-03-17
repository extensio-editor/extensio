<template>
  <div id="project">
    <div id="tabBar" class="layoutItem"></div>
    <div id="fileView" class="layoutItem">
      <span class="file" v-for="(value, key) in files" :key="key">
        <span class="fileFolderIndicator">{{ value ? "&gt;" : "" }}</span
        ><span>{{ key }}</span>
      </span>
    </div>
    <div id="bottomArea" class="layoutItem"></div>
    <div id="mainArea" class="layoutItem">
      <div id="noFileSelected">
        <h1>No file selected</h1>
        <h3>Click on a file in the file view to open it</h3>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@border: 2px dotted #444356;
@foreground-col: #c1c0c9ff;

#project {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 0.3fr 2.5fr 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  width: 100%;
  height: 90vh;
}

#noFileSelected {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.file {
  padding: 3px;
  border-top: @border;
  text-wrap: nowrap;
}

.file:hover {
  background-color: #807d9b;
}

.layoutItem {
  // border: 1px solid orange;
}

.fileFolderIndicator {
  width: 20px;
  display: inline-block;
  text-align: center;
  opacity: 50%;
}

#tabBar {
  grid-area: 1 / 2 / 2 / 3;
  background-color: #22212b;
}

#fileView {
  grid-area: 1 / 1 / 3 / 2;
  border-right: @border;
  display: flex;
  flex-direction: column;
  text-align: left;
}

#bottomArea {
  border-top: @border;
  grid-area: 3 / 1 / 4 / 3;
}

#mainArea {
  grid-area: 2 / 2 / 3 / 3;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

const backend_url = "http://localhost:8081";

export default defineComponent({
  name: "ProjectView",
  data() {
    return {
      files: [] as string[],
    };
  },
  mounted() {
    this.getProject();
  },
  methods: {
    getProject() {
      fetch(`${backend_url}/files`)
        .then((response) => response.json())
        .then((data) => {
          this.files = data;
          console.log(data);
        })
        .then(() => {
          fetch(`${backend_url}/rpc/update`);
        });
    },
  },
});
</script>
