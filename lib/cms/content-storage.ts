import "server-only";
import { createJsonFileDriver } from "./storage";
import { emptyContentOverrides, type ContentOverrides } from "./content-types";

const driver = createJsonFileDriver<ContentOverrides>(
  "content-overrides.json",
  emptyContentOverrides
);

export function readContentOverrides(): ContentOverrides {
  return driver.read();
}

export function writeContentOverrides(data: ContentOverrides): void {
  driver.write(data);
}
