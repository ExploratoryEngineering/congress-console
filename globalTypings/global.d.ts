/**
 * Data model received from WebSocket events and from /data endpoints
 */
interface MessageData {
  "devAddr": string,
  "timestamp": number,
  "data": string,
  "appEUI": string,
  "deviceEUI": string,
  "rssi": number,
  "snr": number,
  "frequency": number,
  "gatewayEUI": string,
  "dataRate": string
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
