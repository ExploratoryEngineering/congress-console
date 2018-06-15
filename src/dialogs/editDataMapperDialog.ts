import { AVAILABLE_MAPPERS_TYPES, IMapper } from "@exploratoryengineering/data-mapper-chain";
import { DialogController } from "aurelia-dialog";
import { autoinject, bindable, PLATFORM, useView } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Create data mapper dialog");

@autoinject
@useView(PLATFORM.moduleName("dialogs/dataMapperDialog.html"))
export class CreateDataMapperDialog {
  availableMappers = AVAILABLE_MAPPERS_TYPES;

  @bindable
  selectedMapperType: string;
  dataMapper: IMapper;

  headerText = "Update data mapper";
  confirmButtonText = "Update mapper";
  config: any = {};

  constructor(
    private dialogController: DialogController,
  ) { }

  cancel() {
    this.dialogController.cancel();
  }

  submitDataMapper() {
    this.dialogController.ok(this.dataMapper);
  }

  activate(args) {
    const dataMapper = args.dataMapper as IMapper;
    if (dataMapper) {
      const mapperConfig = dataMapper.config();
      this.selectedMapperType = mapperConfig.ident;
      this.dataMapper = dataMapper;
    } else {
      this.selectedMapperType = AVAILABLE_MAPPERS_TYPES[0].id;
      this.createNewMapperById(AVAILABLE_MAPPERS_TYPES[0].id);
    }
  }

  selectedMapperTypeChanged(newMapperId) {
    this.createNewMapperById(newMapperId);
  }

  createNewMapperById(id) {
    const mapperType = AVAILABLE_MAPPERS_TYPES.find((mapper) => {
      return mapper.id === id;
    });

    if (mapperType) {
      this.dataMapper = new mapperType.entity({});
      Log.debug("Created new data mapper", mapperType, this.dataMapper);
    }
  }
}
