<template>
  <div class="home">
    <h1>Hello there</h1>
    <h3>Welcome to the Extensio code editor!</h3>
    <hr class="mediocre" />
    <br />
    <h2>Get started</h2>
    <div class="buttonContainer">
      <button @click="openDirectory()" class="projectButton">
        <SVGicon
          name="folder"
          icon-width="20px"
          icon-height="20px"
          color="#2a1f31"
        />
        &nbsp;
        <span id="buttonText">Open an existing project</span>
      </button>
    </div>
    <br />
    <hr-text color="#2a1f31" text="OR" unselectable></hr-text>
    <br />
    <div class="buttonContainer">
      <button class="projectButton">
        <SVGicon
          name="add"
          icon-width="20px"
          icon-height="20px"
          color="#2a1f31"
        />
        &nbsp;
        <span id="buttonText">Create a new project</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import hrText from "@/components/hrText.vue";
import SVGicon from "@/components/SVGicon.vue";

export default defineComponent({
  name: "HomeView",
  components: { hrText, SVGicon },
  methods: {
    openDirectory() {
      const req = new Request("http://localhost:8081/project/open");
      fetch(req)
        .then((response) => {
          if (response.status === 202) {
            return;
          }

          let data = response.json();
          return data;
        })
        .then((data) => {
          const folder = data["filePaths"][0];
          console.log(`opening ${folder} `);
        });
    },
  },
});
</script>

<style lang="less">
@background-accent: #2a1f31;

@buttonHeight: 30px;

.projectButton {
  border: @background-accent 2px solid;
  border-radius: 3px;
  color: inherit;
  background-color: inherit;
  width: max-content;
  height: @buttonHeight;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-around;
  transition: ease-out 50ms;
}

.projectButton:hover {
  transition-duration: 120ms;
  border: #c1c0c9ff 1px solid;
}

.buttonContainer {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
