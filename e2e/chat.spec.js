import { test, expect } from "@playwright/test";

test("sends a chat message and renders the mocked response", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    const body = [
      'data: {"type":"start","messageId":"mock-message"}',
      "",
      'data: {"type":"text-start","id":"mock-text"}',
      "",
      'data: {"type":"text-delta","id":"mock-text","delta":"Mocked assistant response"}',
      "",
      'data: {"type":"text-end","id":"mock-text"}',
      "",
      'data: {"type":"finish"}',
      "",
    ].join("\\n");

    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      headers: { "x-vercel-ai-ui-message-stream": "v1" },
      body,
    });
  });

  await page.goto("/chat");
  await page.getByPlaceholder("Type a message...").fill("What can you help me build?");
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByText("Mocked assistant response")).toBeVisible();
});
