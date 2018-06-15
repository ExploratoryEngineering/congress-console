import { DataMapperChain, IDataValue, IMapper } from "@exploratoryengineering/data-mapper-chain";
import { DialogController, DialogService } from "aurelia-dialog";
import { autoinject, bindable, PLATFORM } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Application dialog");

@autoinject
export class CreateDataMapperChainDialog {
  dataMapper: DataMapperChain;

  @bindable
  testString: string = "";
  testResult: IDataValue = "";

  constructor(
    private dialogController: DialogController,
    private dialogService: DialogService,
  ) {
    this.dataMapper = new DataMapperChain();
  }

  addDataMapper() {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/createDataMapperDialog"),
      model: {},
    }).whenClosed((output) => {
      if (!output.wasCancelled) {
        Log.debug("Added mapper", output.output);
        this.dataMapper.addMapper(output.output);
        this.testChain();
      }
    });
  }

  removeDataMapper(index: number) {
    this.dataMapper.mappers.splice(index, 1);
    this.testChain();
  }

  updateDataMapper(mapper: IMapper) {
    const untouchedMapper = this.dataMapper.createMapperByConfig(mapper.config());
    Log.debug("Update data mapper", untouchedMapper);
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/editDataMapperDialog"),
      model: {
        dataMapper: untouchedMapper,
      },
    }).whenClosed((output) => {
      if (!output.wasCancelled) {
        this.dataMapper.mappers.splice(this.dataMapper.mappers.indexOf(mapper), 1, output.output);
        this.testChain();
      }
    });
  }

  submitDataMapper() {
    Log.debug("Submitting data mapper", this.dataMapper);
    this.dialogController.ok(this.dataMapper);
  }

  cancel() {
    this.dialogController.cancel();
  }

  testChain() {
    this.testResult = this.dataMapper.mapData(this.testString);
  }

  testStringChanged() {
    this.testChain();
  }
}
