const { registerExtension } = require(process.cwd() + "/api/extensionAPI.js");

function greet(name) {
  console.log(`Hello, ${name}!`);
}

const extension = {
  name: "helloWorldExtension",
  mountsOn: "homeScreen",
  template:
    '<div style="width: 100%; display: flex; justify-content: center; position: absolute; left: 0; top: 50%; transform: translateY(-50%)">This is my extension</div>',
  methods: [greet.toString()],
  main: (() => {
    console.log("Hello World!");
  }).toString(),
};

registerExtension(extension);
