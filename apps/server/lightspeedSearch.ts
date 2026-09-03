import { FileFinder } from "@ff-labs/fff-node";
import type { fffInstance, fileItem } from "./types.ts";

export default class lightSpeedSearch {
  projectInstances: fffInstance
  constructor() {
    this.projectInstances = {};
  }

  async indexProject(path: string): Promise<FileFinder | undefined> {
    const fffInstance = FileFinder.create({ basePath: path });
    if(!fffInstance.ok) {
      throw new Error(fffInstance.error)
    }

    const doesExist = Object.keys(this.projectInstances).find(project => project == path);

    if(!doesExist) {
      console.log("FFF instance: ", fffInstance);
      const finder = fffInstance.value;

      // Does an initial scan of the project
      await finder.waitForScan(250);

      // Save the finder instance via project path
      this.projectInstances[path] = finder;
      return finder;
    } else {
      return this.projectInstances[doesExist];
    }
  }

  executeFileSearch(fileInstance : FileFinder, query : string) : fileItem[] {
    const files = fileInstance.fileSearch(query, { pageSize: 10 });
    if(!files.ok) {
      throw new Error('There was an error with the file instance: ' + files.error);
    }

    const searchResults: fileItem[] = []

    files.value.items.forEach((fileObj) => {
      const { relativePath, fileName } = fileObj;
      console.log('files: ', { relativePath, fileName });

        searchResults.push({ relativePath, fileName })
    });

    return searchResults
  }
}

