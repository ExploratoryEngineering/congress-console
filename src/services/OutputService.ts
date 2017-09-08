import { autoinject } from 'aurelia-framework';

import { ApiClient } from 'Helpers/ApiClient';
import { Output } from 'Models/Output';

@autoinject
export class OutputService {
  constructor(
    private apiClient: ApiClient
  ) { }

  getOutputsForApplication(applicationEui: string): Promise<Output[]> {
    return this.apiClient.http.get(
      `/applications/${applicationEui}/outputs`
    ).then(data => data.content.outputs)
      .then(outputs => {
        return outputs.map(Output.newFromDto);
      });
  }
}
