import {
  SignalStrength,
  LOW_SIGNAL_ICON_CLASS,
  LOW_SIGNAL_THRESHOLD,
  MEDIUM_SIGNAL_ICON_CLASS,
  HIGH_SIGNAL_ICON_CLASS,
  HIGH_SIGNAL_THRESHOLD,
  UNKNOWN_SIGNAL_ICON_CLASS,
  UNKNOWN_SIGNAL_STRING,
  SIGNAL_STRENGTH_UNIT
} from 'Components/signal-strength';

describe('Signal strength component', () => {
  let signalStrength: SignalStrength;
  let mockMessageData: MessageData;

  beforeEach(() => {
    signalStrength = new SignalStrength();
    mockMessageData = {
      devAddr: '',
      timestamp: 0,
      data: '',
      appEUI: '1234',
      deviceEUI: '1234',
      rssi: 0,
      snr: 0,
      frequency: 0,
      gatewayEUI: '1234',
      dataRate: ''
    };
  });

  describe('Icon classes', () => {
    it('should correctly return low signal class when having a low signal', () => {
      mockMessageData.rssi = LOW_SIGNAL_THRESHOLD - 1;
      signalStrength.messageData = mockMessageData;

      expect(signalStrength.getIconClass).toBe(LOW_SIGNAL_ICON_CLASS);
    });

    it('should correctly return medium signal class when having a medium signal', () => {
      mockMessageData.rssi = LOW_SIGNAL_THRESHOLD + 1;
      signalStrength.messageData = mockMessageData;

      expect(signalStrength.getIconClass).toBe(MEDIUM_SIGNAL_ICON_CLASS);
    });

    it('should correctly return high signal class when having a high signal', () => {
      mockMessageData.rssi = HIGH_SIGNAL_THRESHOLD + 1;
      signalStrength.messageData = mockMessageData;

      expect(signalStrength.getIconClass).toBe(HIGH_SIGNAL_ICON_CLASS);
    });

    it('should correctly return unknown when no messageData is supplied', () => {
      expect(signalStrength.getIconClass).toBe(UNKNOWN_SIGNAL_ICON_CLASS);
    });
  });

  describe('Text string', () => {
    it('should return unknown when no messageData is supplied', () => {
      expect(signalStrength.signalStrengthString).toBe(UNKNOWN_SIGNAL_STRING);
    });

    it('should return the value with the correct unit when messageData is supplied', () => {
      mockMessageData.rssi = 15;
      signalStrength.messageData = mockMessageData;
      signalStrength.getIconClass;
      expect(signalStrength.signalStrengthString).toBe(`15 ${SIGNAL_STRENGTH_UNIT}`);
    });
  });
});
