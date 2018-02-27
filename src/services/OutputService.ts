/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

import { autoinject } from "aurelia-framework";

import { ApiClient } from "Helpers/ApiClient";
import { Output } from "Models/Output";

@autoinject
export class OutputService {
  constructor(
    private apiClient: ApiClient,
  ) { }

  getOutputByEui(applicationEui: string, outputEui: string): Promise<Output> {
    return this.apiClient.http.get(
      `/applications/${applicationEui}/outputs/${outputEui}`,
    ).then((data) => data.content)
      .then((output) => {
        return Output.newFromDto(output);
      });
  }

  getOutputsForApplication(applicationEui: string): Promise<Output[]> {
    return this.apiClient.http.get(
      `/applications/${applicationEui}/outputs`,
    ).then((data) => data.content.outputs)
      .then((outputs) => {
        return outputs.map(Output.newFromDto);
      });
  }

  createOutput(applicationEui: string, output: Output): Promise<Output> {
    return this.apiClient.http.post(
      `/applications/${applicationEui}/outputs`,
      Output.toDto(output),
    ).then((data) => data.content)
      .then((newOutput) => Output.newFromDto(newOutput));
  }

  updateOutput(applicationEui: string, output: Output): Promise<Output> {
    return this.apiClient.http.put(
      `/applications/${applicationEui}/outputs/${output.eui}`,
      Output.toDto(output),
    ).then((data) => data.content)
      .then((updatedOutput) => Output.newFromDto(updatedOutput));
  }

  deleteOutput(applicationEui: string, outputEui: string): Promise<any> {
    return this.apiClient.http.delete(
      `/applications/${applicationEui}/outputs/${outputEui}`,
    );
  }
}
