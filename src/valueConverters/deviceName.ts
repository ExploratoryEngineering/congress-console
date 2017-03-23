const mapper = {
  '00-09-09-00-00-00-00-0a': 'Roald',
  '00-09-09-00-00-00-00-09': 'BRB',
  '00-09-09-00-00-00-00-0b': 'WTF',
  '00-09-09-00-00-00-00-07': 'Sune',
  '00-09-09-00-00-00-00-0c': 'Game room',
  '00-09-09-00-00-00-00-08': 'Column EE'
};

/**
 * Weak mapper for device EUI to something managable.
 * This should be included in the device data model.
 */
export class DeviceNameValueConverter {
  toView(deviceEUI) {
    if (mapper[deviceEUI]) {
      return mapper[deviceEUI];
    } else {
      return deviceEUI;
    }
  }
}
