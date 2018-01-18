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
