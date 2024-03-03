<template>
  <div id="fullBackground">
    <div id="newProjectBox">
      <button
        @click="openDirectory()"
        id="createProjectButton"
        class="unselectable iconButton"
      >
        <SVGicon name="folder" icon-height="20" icon-width="20" /> &nbsp; Select
        folder
      </button>
      <small class="folderDisclaimerText"
        >if no folder selected will use desktop</small
      >
      <form action="http://localhost:8081/project/new" method="post">
        <div id="formField">
          <input
            required="true"
            class="unselectable"
            type="text"
            name="filename"
            id="filename"
            placeholder="project name"
          />
          <br />
          <div id="checkboxesbox">
            <label class="unselectable" id="rootCheckbox">
              <input type="checkbox" name="root" id="isRoot" checked />
              <span>Selected folder is project root</span>
            </label>
            <label class="unselectable" id="gitCheckbox">
              <input type="checkbox" name="git" id="createGit" checked />
              <span>Create git repo</span>
            </label>
          </div>
          <br />
          <button id="createProjectButton" class="unselectable">
            Create project
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import SVGicon from "./SVGicon.vue";

export default {
  data() {
    return {};
  },
  components: {
    SVGicon,
  },
  methods: {
    openDirectory() {
      const req = new Request("http://localhost:8081/project/open");
      fetch(req)
        .then((response) => {
          if (response.status === 202) {
            alert("is canculed :(");
            return;
          }

          let data = response.json();
          return data;
        })
        .then((data) => {
          if (!data) return;
          const folder = data["filePaths"][0];
          console.log(`opening ${folder} `);
        });
    },
  },
};
</script>

<style lang="less">
@background-col: #302f3dff;
@background-accent: #2a1f31;

#checkboxesbox {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.folderDisclaimerText {
  color: @background-accent;
}

.iconButton {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

#createProjectButton {
  background-color: @background-col;
  color: inherit;
  border: @background-accent 2px solid;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
}

input#filename {
  background-color: @background-col;
  color: inherit;
  border: @background-accent 2px solid;
  border-radius: 5px;
  padding: 10px;
}

#formField {
  width: max-content;
  height: max-content;
  display: flex;
  flex-direction: column;
  justify-content: left;
}

#rootCheckbox {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#fullBackground {
  z-index: 998;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
}

#newProjectBox {
  z-index: 999;
  width: 40vw;
  height: 30vh;
  background-color: @background-col;
  border: @background-accent 2px solid;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: fit-content;
}

.unselectable {
  -webkit-user-select: none;
  user-select: none;
}
</style>
