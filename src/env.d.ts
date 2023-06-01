/// <reference types="astro/client" />

import type { LaunchControl } from "./launch-control";

declare global {
  interface Window {
    launchControl: LaunchControl;
  }
}
