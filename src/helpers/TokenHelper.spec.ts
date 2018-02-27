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

import { TokenHelper } from "Helpers/TokenHelper";
import { Application } from "Models/Application";
import { Gateway } from "Models/Gateway";
import { Token } from "Models/Token";

const tokenHelper = new TokenHelper();

describe("TokenHelper", () => {
  describe("description", () => {
    const CORRECT_DESCRIPTIONS = {
      FULL_ACCESS_ALL_RESOURCES: "The API key has full access to all resources",
      READ_ACCESS_ALL_RESOURCES: "The API key has read access to all resources",

      FULL_ACCESS_APPLICATIONS: "The API key has full access to all applications",
      READ_ACCESS_APPLICATIONS: "The API key has read access to all applications",

      FULL_ACCESS_GATEWAYS: "The API key has full access to all gateways",
      READ_ACCESS_GATEWAYS: "The API key has read access to all gateways",

      FULL_ACCESS_SPECIFIC_APPLICATION: "The API key has full access to applications with id testid",
      READ_ACCESS_SPECIFIC_APPLICATION: "The API key has read access to applications with id testid",

      FULL_ACCESS_SPECIFIC_GATEWAY: "The API key has full access to gateways with id testid",
      READ_ACCESS_SPECIFIC_GATEWAY: "The API key has read access to gateways with id testid",
    };

    it("should give correct description upon having full access to all resources", () => {
      const token = new Token({
        resource: "/",
        write: true,
      });

      expect(tokenHelper.getDescription(token)).toBe(CORRECT_DESCRIPTIONS.FULL_ACCESS_ALL_RESOURCES);
    });

    it("should give correct description upon having read access to all resources", () => {
      const token = new Token({
        resource: "/",
        write: false,
      });

      expect(tokenHelper.getDescription(token)).toBe(CORRECT_DESCRIPTIONS.READ_ACCESS_ALL_RESOURCES);
    });

    it("should give correct description upon having full access to all applications", () => {
      const token = new Token({
        resource: "/applications",
        write: true,
      });

      expect(tokenHelper.getDescription(token)).toBe(CORRECT_DESCRIPTIONS.FULL_ACCESS_APPLICATIONS);
    });

    it("should give correct description upon having read access to all applications", () => {
      const token = new Token({
        resource: "/applications",
        write: false,
      });

      expect(tokenHelper.getDescription(token)).toBe(CORRECT_DESCRIPTIONS.READ_ACCESS_APPLICATIONS);
    });

    it("should give correct description upon having full access to all gateways", () => {
      const token = new Token({
        resource: "/gateways",
        write: true,
      });

      expect(tokenHelper.getDescription(token)).toBe(CORRECT_DESCRIPTIONS.FULL_ACCESS_GATEWAYS);
    });

    it("should give correct description upon having read access to all gateways", () => {
      const token = new Token({
        resource: "/gateways",
        write: false,
      });

      expect(tokenHelper.getDescription(token)).toBe(CORRECT_DESCRIPTIONS.READ_ACCESS_GATEWAYS);
    });

    it("should give correct description upon having full access to a specific application", () => {
      const token = new Token({
        resource: "/applications/testid",
        write: true,
      });

      expect(tokenHelper.getDescription(token)).toBe(CORRECT_DESCRIPTIONS.FULL_ACCESS_SPECIFIC_APPLICATION);
    });

    it("should give correct description upon having read access to a specific application", () => {
      const token = new Token({
        resource: "/applications/testid",
        write: false,
      });

      expect(tokenHelper.getDescription(token)).toBe(CORRECT_DESCRIPTIONS.READ_ACCESS_SPECIFIC_APPLICATION);
    });

    it("should give correct description upon having full access to a specific gateway", () => {
      const token = new Token({
        resource: "/gateways/testid",
        write: true,
      });

      expect(tokenHelper.getDescription(token)).toBe(CORRECT_DESCRIPTIONS.FULL_ACCESS_SPECIFIC_GATEWAY);
    });

    it("should give correct description upon having read access to a specific gateway", () => {
      const token = new Token({
        resource: "/gateways/testid",
        write: false,
      });

      expect(tokenHelper.getDescription(token)).toBe(CORRECT_DESCRIPTIONS.READ_ACCESS_SPECIFIC_GATEWAY);
    });
  });

  describe("token rights", () => {
    it("should give correct token rights upon having access to all resources", () => {
      const token = new Token({
        resource: "/",
      });

      expect(tokenHelper.getTokenRights(token)).toEqual({
        resource: "all",
        resourceId: "all",
      });
    });

    it("should give correct token rights upon having access to all applications", () => {
      const token = new Token({
        resource: "/applications",
      });

      expect(tokenHelper.getTokenRights(token)).toEqual({
        resource: "applications",
        resourceId: "all",
      });
    });

    it("should give correct token rights upon having access to all gateways", () => {
      const token = new Token({
        resource: "/gateways",
      });

      expect(tokenHelper.getTokenRights(token)).toEqual({
        resource: "gateways",
        resourceId: "all",
      });
    });

    it("should give correct token rights upon having access to a specific application", () => {
      const token = new Token({
        resource: "/applications/testid",
      });

      expect(tokenHelper.getTokenRights(token)).toEqual({
        resource: "applications",
        resourceId: "testid",
      });
    });

    it("should give correct token rights upon having access to a specific gateway", () => {
      const token = new Token({
        resource: "/gateways/testid",
      });

      expect(tokenHelper.getTokenRights(token)).toEqual({
        resource: "gateways",
        resourceId: "testid",
      });
    });
  });

  describe("dangling tokens", () => {
    const applications: Application[] = [
      new Application({
        appEUI: "testId1",
      }),
      new Application({
        appEUI: "testId2",
      }),
      new Application({
        appEUI: "testId3",
      }),
    ];

    const gateways: Gateway[] = [
      new Gateway({
        gatewayEUI: "testId1",
      }),
      new Gateway({
        gatewayEUI: "testId2",
      }),
      new Gateway({
        gatewayEUI: "testId3",
      }),
    ];

    it("should return true when token is dangling from an application", () => {
      const token = new Token({
        resource: "/applications/nonExistingId",
      });

      expect(tokenHelper.isTokenDangling(token, {
        applications: applications,
        gateways: gateways,
      })).toBe(true);
    });

    it("should return true when token is dangling from a gateway", () => {
      const token = new Token({
        resource: "/gateways/nonExistingId",
      });

      expect(tokenHelper.isTokenDangling(token, {
        applications: applications,
        gateways: gateways,
      })).toBe(true);
    });

    it("should return false if token has access to all applications", () => {
      const token = new Token({
        resource: "/applications",
      });

      expect(tokenHelper.isTokenDangling(token, {
        applications: applications,
        gateways: gateways,
      })).toBe(false);
    });

    it("should return false if token has access to all gateways", () => {
      const token = new Token({
        resource: "/gateways",
      });

      expect(tokenHelper.isTokenDangling(token, {
        applications: applications,
        gateways: gateways,
      })).toBe(false);
    });

    it("should return false if token has access to all resources", () => {
      const token = new Token({
        resource: "/",
      });

      expect(tokenHelper.isTokenDangling(token, {
        applications: applications,
        gateways: gateways,
      })).toBe(false);
    });

    it("should return false if application id exists", () => {
      const token = new Token({
        resource: "/applications/testId2",
      });

      expect(tokenHelper.isTokenDangling(token, {
        applications: applications,
        gateways: gateways,
      })).toBe(false);
    });

    it("should return false if gateway id exists", () => {
      const token = new Token({
        resource: "/gateways/testId2",
      });

      expect(tokenHelper.isTokenDangling(token, {
        applications: applications,
        gateways: gateways,
      })).toBe(false);
    });
  });
});
