import path from "node:path";

export default class NavigationService {
  changeDirectory(directory) {
    process.chdir(path.resolve(directory));
  }

  goUp() {
    this.changeDirectory("..");
  }
}
