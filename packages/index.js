import MyButton from "./button";

const components = {
  MyButton,
};

const install = function (Vue) {
    if (install.installed) return
    install.installed = true
    for (let obj in components) {
        
      let comp = components[obj]
      console.log('obj', comp)
      Vue.component(comp.name, comp)
    }
  }

/* istanbul ignore if */
if (typeof window !== undefined && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  version: "0.1.0",
  ...components,
};
