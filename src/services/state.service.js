export default class StateService {
  exit(name) {
    console.log(`Thank you for using File Manager, ${name}, goodbye!`);
    process.exit();
  }
}
