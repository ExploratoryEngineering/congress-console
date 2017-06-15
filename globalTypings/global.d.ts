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

/**
 * Tag implementation for application
 */
interface Tag {
  key: string;
  value: string;
}

/**
 * Tagobject exisisting on TagEntities
 */
interface TagObject {
  [tagName: string]: string;
}


/**
 * An entity which contains a tag field with TagObject
 */
interface TagEntity {
  tags: TagObject;
}
