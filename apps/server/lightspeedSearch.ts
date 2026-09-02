import { FileFinder } from "@ff-labs/fff-node";

class lightSpeedSearch {
  constructor() {
    this.projectInstances = {};
  }

  async indexProject(path: string) {
    const fffInstance = FileFinder.create({ basePath: path });
    if(!fffInstance.ok) {
      throw new Error(fffInstance.error)
    }

    console.log("FFF instance: ", fffInstance);
    const finder = fffInstance.value;

    // Does an initial scan of the project
    await finder.waitForScan(250);

    // Save the finder instance via project path
    this.projectInstances[path] = finder;
  }
}