<template>
  <div id="fullBackground" @click.self="leave()">
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
        ><span v-if="selectedFolder === undefined"
          >if no folder selected will use desktop</span
        >
        <span v-else> {{ selectedFolder }} </span>
      </small>
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
        <button
          id="createProjectButton"
          class="unselectable"
          @click="submitIfValid()"
        >
          Create project
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SVGicon from "./SVGicon.vue";

export default defineComponent({
  data() {
    return {
      selectedFolder: undefined as unknown as string,
      fullSelectedFolder: undefined as unknown as string,
    };
  },
  emits: ["reset-new-project"],
  components: {
    SVGicon,
  },
  methods: {
    submitIfValid() {
      // POST http://localhost:8081/project/new
      const projectNameBox: HTMLInputElement = document.getElementById(
        "filename"
      ) as HTMLInputElement;
      const projectName: string = projectNameBox.value;

      if (projectName.trim() == "") {
        alert("No you goofball,\nProject name can not be empty!"); // With this electron loses its focus. Need to exchange for custom alert system.
        return;
      }

      const isRootBox: HTMLInputElement = document.getElementById(
        "isRoot"
      ) as HTMLInputElement;
      const doGitBox: HTMLInputElement = document.getElementById(
        "createGit"
      ) as HTMLInputElement;

      // Submit the actual data
      fetch("http://localhost:8081/project/new", {
        method: "POST",
        body: JSON.stringify({
          project: {
            name: projectName as string,
            location: this.fullSelectedFolder as string,
            isRoot: isRootBox.checked as boolean,
            createGit: doGitBox.checked as boolean,
          },
        }),
        headers: new Headers({ "content-type": "application/json" }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });
    },
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
          this.fullSelectedFolder = folder;
          let path;
          // Only get the last 3 items in the path
          if (folder.startsWith("C:\\")) {
            // For windows
            path = folder.split("\\");
          } else {
            // For unix based systems
            // (linux & macos)
            path = folder.split("/");
          }
          path = path.slice(-3);
          this.selectedFolder = ".../" + path.join("/");
        });
    },
    leave() {
      this.$emit("reset-new-project");
    },
  },
});
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
