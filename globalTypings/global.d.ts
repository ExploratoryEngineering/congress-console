/**
 * Data model received from WebSocket events and from /data endpoints
 */
interface MessageData {
  "DevAddr": string,
  "Timestamp": number,
  "Data": string,
  "AppEUI": string,
  "DeviceEUI": string,
  "RSSI": number,
  "SNR": number,
  "Frequency": number,
  "GatewayEUI": string,
  "DataRate": string
}

/**
 * Input search parameters when getting data for either applications 
 * or devices
 */
interface DataSearchParameters {
  limit?: number;
  since?: string;
}
