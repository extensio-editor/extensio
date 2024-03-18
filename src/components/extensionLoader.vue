<script lang="ts">
import { defineComponent } from "vue";
import { extension } from "@/../api/extensionAPI";

export default defineComponent({
  name: "extensionLoader",
  async mounted() {
    // Get extensions
    const data = await fetch("http://localhost:8081/extensions/get");
    const extensions = (await data.json()) as extension[];

    extensions.forEach((extension: extension) => {
      if (!document.getElementById(extension.mountsOn)) {
        return;
      }

      const main = eval(extension.main);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      document.getElementById(extension.mountsOn)!.innerHTML =
        extension.template;

      main();
    });
  },
});
</script>
