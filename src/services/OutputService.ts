import { autoinject } from 'aurelia-framework';

import { ApiClient } from 'Helpers/ApiClient';
import { Output } from 'Models/Output';

@autoinject
export class OutputService {
  constructor(
    private apiClient: ApiClient
  ) { }

  getOutputByEui(applicationEui: string, outputEui: string): Promise<Output> {
    return this.apiClient.http.get(
      `/applications/${applicationEui}/outputs/${outputEui}`
    ).then(data => data.content)
      .then(output => {
        return Output.newFromDto(output);
      });
  }

  getOutputsForApplication(applicationEui: string): Promise<Output[]> {
    return this.apiClient.http.get(
      `/applications/${applicationEui}/outputs`
    ).then(data => data.content.outputs)
      .then(outputs => {
        return outputs.map(Output.newFromDto);
      });
  }


  createOutput(applicationEui: string, output: Output): Promise<Output> {
    return this.apiClient.http.post(
      `/applications/${applicationEui}/outputs`,
      Output.toDto(output)
    ).then(data => data.content)
      .then(output => Output.newFromDto(output));
  }

  updateOutput(applicationEui: string, output: Output): Promise<Output> {
    return this.apiClient.http.put(
      `/applications/${applicationEui}/outputs/${output.eui}`,
      Output.toDto(output)
    ).then(data => data.content)
      .then(output => Output.newFromDto(output));
  }

  deleteOutput(applicationEui: string, outputEui: string): Promise<any> {
    return this.apiClient.http.delete(
      `/applications/${applicationEui}/outputs/${outputEui}`
    );
  }
}
