declare module 'pjs-fellowship/index' {
  export {};

}
declare module 'pjs-fellowship' {
  import main = require('pjs-fellowship/src/index');
  export = main;
}