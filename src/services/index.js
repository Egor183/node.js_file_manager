import CryptoService from "./crypto.service.js";
import FilesService from "./files.service.js";
import NavigationService from "./navigation.service.js";
import OSService from "./os.service.js";
import StateService from "./state.service.js";
import ZipService from "./zip.service.js";

class Services {
  constructor() {
    this.filesService = new FilesService();
    this.stateService = new StateService();
    this.navigationService = new NavigationService();
    this.osService = new OSService();
    this.cryptoService = new CryptoService();
    this.zipService = new ZipService();
  }
}

export const {
  filesService,
  stateService,
  navigationService,
  osService,
  cryptoService,
  zipService,
} = new Services();
