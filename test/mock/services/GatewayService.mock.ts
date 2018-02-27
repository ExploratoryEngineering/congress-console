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

import { Gateway } from "Models/Gateway";

interface GatewayStats {
  messagesIn: number[];
  messagesOut: number[];
}

export class GatewayServiceMock {
  fetchPersonalGateways(): Promise<Gateway[]> {
    return Promise.resolve([]);
  }

  fetchPublicGateways(): Promise<Gateway[]> {
    return Promise.resolve([]);
  }

  fetchGatewayStatsByEUI(gatewayEui: string): Promise<GatewayStats> {
    return Promise.resolve({
      messagesIn: [],
      messagesOut: [],
    });
  }

  createNewGateway(gateway: Gateway): Promise<Gateway> {
    return Promise.resolve(gateway);
  }

  editGateway(gateway: Gateway): Promise<Gateway> {
    return Promise.resolve(gateway);
  }

  deleteGateway(gateway: Gateway) {
    return Promise.resolve();
  }
}
