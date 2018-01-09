import { Application } from "Models/Application";
import { Gateway } from "Models/Gateway";
import { Token } from "Models/Token";
import { DialogControllerMock, TokenServiceMock } from "Test/mock/mocks";
import { EditTokenDialog } from "./editTokenDialog";

describe("Edit token dialog", () => {
  let editTokenDialog: EditTokenDialog;

  let dialogControllerMock;
  let tokenServiceMock;

  beforeEach(() => {
    dialogControllerMock = new DialogControllerMock();
    tokenServiceMock = new TokenServiceMock();
    editTokenDialog = new EditTokenDialog(
      dialogControllerMock,
      tokenServiceMock,
    );
  });

  describe("activate", () => {
    it("should correctly propagate applications", () => {
      const applications = [new Application(), new Application()];

      editTokenDialog.activate({
        applications: applications,
        gateways: [],
        token: new Token(),
      });

      expect(editTokenDialog.applications).toBe(applications);
    });

    it("should correctly propagate gateways", () => {
      const gateways = [new Gateway(), new Gateway()];

      editTokenDialog.activate({
        applications: [],
        gateways: gateways,
        token: new Token(),
      });

      expect(editTokenDialog.gateways).toBe(gateways);
    });

    it("should correctly set selectedAccessLevel fullaccess from token", () => {
      const token = new Token({
        write: true,
      });

      editTokenDialog.activate({
        applications: [],
        gateways: [],
        token: token,
      });

      expect(editTokenDialog.selectedAccessLevel).toBe("fullaccess");
    });

    it("should correctly set selectedAccessLevel to readonly from token", () => {
      const token = new Token({
        write: false,
      });

      editTokenDialog.activate({
        applications: [],
        gateways: [],
        token: token,
      });

      expect(editTokenDialog.selectedAccessLevel).toBe("readonly");
    });

    it("should correctly set resourceAccess to applications from token", () => {
      const token = new Token({
        resource: "/applications",
      });

      editTokenDialog.activate({
        applications: [],
        gateways: [],
        token: token,
      });

      expect(editTokenDialog.selectedResourceAccess).toBe("applications");
    });

    it("should correctly set resourceAccess to gateways from token", () => {
      const token = new Token({
        resource: "/gateways",
      });

      editTokenDialog.activate({
        applications: [],
        gateways: [],
        token: token,
      });

      expect(editTokenDialog.selectedResourceAccess).toBe("gateways");
    });

    it("should correctly set resourceAccess to specific_application from token", () => {
      const token = new Token({
        resource: "/applications/123",
      });

      editTokenDialog.activate({
        applications: [],
        gateways: [],
        token: token,
      });

      expect(editTokenDialog.selectedResourceAccess).toBe("specific_application");
      expect(editTokenDialog.selectedApplication).toBe("123");
    });

    it("should correctly set resourceAccess to specific gateway from token", () => {
      const token = new Token({
        resource: "/gateways/123",
      });

      editTokenDialog.activate({
        applications: [],
        gateways: [],
        token: token,
      });

      expect(editTokenDialog.selectedResourceAccess).toBe("specific_gateway");
      expect(editTokenDialog.selectedApplication).toBe("123");
    });
  });
});
