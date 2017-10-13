import { BadRequestError } from 'Helpers/ResponseHandler';
import { Device } from 'Models/Device';
import { CreateDeviceDialog } from 'Dialogs/createDeviceDialog';
import { NewABPDevice } from 'Services/DeviceService';

class DeviceServiceStub {
  createNewDevice() {
    return Promise.resolve(new Device());
  }

  fetchSourceForDevice() {
    return Promise.resolve();
  }
}

class DialogControllerStub {
  settings = {
    overlayDismiss: true
  };

  ok() {
    return Promise.resolve();
  }

  cancel() {
    return Promise.resolve();
  }

}

describe('Create device dialog', () => {
  let createDeviceDialog: CreateDeviceDialog;
  let deviceServiceStub;
  let dialogControllerStub;

  beforeEach(() => {
    deviceServiceStub = new DeviceServiceStub();
    dialogControllerStub = new DialogControllerStub();
    createDeviceDialog = new CreateDeviceDialog(deviceServiceStub, dialogControllerStub);
  });

  describe('lifecycle', () => {
    it('should correctly propagate information from activate', () => {
      createDeviceDialog.activate({
        appEUI: 'TEST'
      });

      expect(createDeviceDialog.appEui).toBe('TEST');
    });
  });

  describe('steps', () => {
    it('should start on the correct step numner', () => {
      expect(createDeviceDialog.step).toBe(1);
    });

    it('should not be able to change step if the step is 3', () => {
      createDeviceDialog.step = 3;

      createDeviceDialog.goToStep(2);

      expect(createDeviceDialog.step).toBe(3);
    });
  });

  describe('next', () => {
    it('should correctly move to next step when first step', () => {
      createDeviceDialog.next();

      expect(createDeviceDialog.step).toBe(2);
    });

    it('should submit device when step two and pressing next step', () => {
      createDeviceDialog.step = 2;
      let createDeviceSpy = spyOn(deviceServiceStub, 'createNewDevice').and.callThrough();

      createDeviceDialog.next();

      expect(createDeviceSpy).toHaveBeenCalled();
    });

    it('should fetch source when step two and pressing next step', (done) => {
      createDeviceDialog.step = 2;
      let fetchSourceForDeviceSpy = spyOn(deviceServiceStub, 'fetchSourceForDevice').and.callThrough();

      createDeviceDialog.next().then(() => {
        expect(fetchSourceForDeviceSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should end up on step three after clicking next on step 2', (done) => {
      createDeviceDialog.step = 2;

      createDeviceDialog.next().then(() => {
        expect(createDeviceDialog.step).toBe(3);
        done();
      });
    });

    it('should add error to formError upon 400', (done) => {
      createDeviceDialog.step = 2;

      spyOn(deviceServiceStub, 'createNewDevice').and.returnValue(
        Promise.reject(
          new BadRequestError('Stuff went wrong and its your fault')
        )
      );

      Promise.all([createDeviceDialog.submitDevice()]).then(() => {
        expect(createDeviceDialog.formError).toBe('Stuff went wrong and its your fault');
        done();
      });
    });

    it('should call cancel on dialogController upon non-400', (done) => {
      createDeviceDialog.step = 2;

      spyOn(deviceServiceStub, 'createNewDevice').and.returnValue(
        Promise.reject(
          new Error('Real bad stuff')
        )
      );
      let cancelSpy = spyOn(dialogControllerStub, 'cancel');

      Promise.all([createDeviceDialog.submitDevice()]).then(() => {
        expect(cancelSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should call ok on dialog controller after clicking next on step 3', () => {
      let okSpy = spyOn(dialogControllerStub, 'ok').and.callThrough();

      createDeviceDialog.step = 3;
      createDeviceDialog.next();

      expect(okSpy).toHaveBeenCalled();
    });

    it('should correctly show next text on step 1', () => {
      expect(createDeviceDialog.nextText).toBe('Configure device');
    });

    it('should correctly show next text on step 2', () => {
      createDeviceDialog.step = 2;
      expect(createDeviceDialog.nextText).toBe('Create device');
    });

    it('should correctly show next text on step 3', () => {
      createDeviceDialog.step = 3;
      expect(createDeviceDialog.nextText).toBe('To new device');
    });

    it('should correctly set overlayDismiss to false upon reaching step 3', (done) => {
      expect(dialogControllerStub.settings.overlayDismiss).toBe(true);
      createDeviceDialog.step = 2;
      createDeviceDialog.next().then(() => {
        expect(dialogControllerStub.settings.overlayDismiss).toBe(false);
        done();
      });
    });
  });

  describe('Device creation', () => {
    it('should have OTAA as default device type', () => {
      expect(createDeviceDialog.selectedType).toBe('OTAA');
    });

    it('should correctly create a device with type OTAA when selected type is OTAA', () => {
      createDeviceDialog.selectedType = 'OTAA';
      expect(createDeviceDialog.getNewDevice().DeviceType).toBe('OTAA');
    });

    it('should correctly create a device with type ABP when selected type is ABP', () => {
      createDeviceDialog.selectedType = 'ABP';
      expect(createDeviceDialog.getNewDevice().DeviceType).toBe('ABP');
    });

    it('should add device to createdDevice upon successful creation', (done) => {
      const device = new Device();

      spyOn(deviceServiceStub, 'createNewDevice').and.returnValue(Promise.resolve(device));

      createDeviceDialog.submitDevice().then(() => {
        expect(createDeviceDialog.createdDevice).toBe(device);
        done();
      });
    });

    it('should automagically pad network session key and application session key on ABP device creation', () => {
      createDeviceDialog.selectedType = 'ABP';

      createDeviceDialog.device.appSKey = '123';
      createDeviceDialog.device.nwkSKey = '456';

      const newDevice = createDeviceDialog.getNewDevice();

      if (newDevice.DeviceType === 'ABP') {
        expect(newDevice.AppSKey).toBe('00000000000000000000000000000123');
        expect(newDevice.NwkSKey).toBe('00000000000000000000000000000456');
      } else {
        fail('The device is not a type of ABP');
      }
    });
  });
});
