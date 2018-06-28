import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";

export const configure = (config: FrameworkConfiguration) => {
  config
    .globalResources([
      PLATFORM.moduleName("components/common/button/tn-button"),
      PLATFORM.moduleName("components/common/card/card"),
      PLATFORM.moduleName("components/common/card/card-header"),
      PLATFORM.moduleName("components/common/card/card-title"),
      PLATFORM.moduleName("components/common/card/card-header-actions"),
      PLATFORM.moduleName("components/common/card/card-body"),
      PLATFORM.moduleName("components/common/card/card-actions"),
      PLATFORM.moduleName("components/common/dropdown/dropdown"),
      PLATFORM.moduleName("components/common/dropdown/dropdown-item.html"),
      PLATFORM.moduleName("components/common/dropdown/dropdown-title"),
      PLATFORM.moduleName("components/common/dropdown/dropdown-container"),
    ]);
};
