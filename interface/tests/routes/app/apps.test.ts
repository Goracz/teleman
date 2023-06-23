import request from "supertest";
import { WebOSEndpoints } from "../../../constants/webos-endpoints";
import createTestEnvironment from "../../utils";
import router from "../../../routes/app/apps";
import { connection } from "../../../index";

describe("Apps Endpoint", () => {
  const mockedApps = {
    data: [
      { id: "app1", name: "App 1" },
      { id: "app2", name: "App 2" },
    ],
  };

  const { app } = createTestEnvironment(router, "/api/v1/app");

  test("GET /api/v1/app", async () => {
    (connection.request as jest.Mock).mockImplementationOnce(
      (url: string, callback: (error: Error | null, response: any) => void) => {
        const apps = { data: mockedApps.data };
        callback(null, apps);
      }
    );

    const response = await request(app).get("/api/v1/app");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedApps);
    expect(connection.request).toHaveBeenCalledWith(
      WebOSEndpoints.LIST_APPS,
      expect.any(Function)
    );
  });
});
