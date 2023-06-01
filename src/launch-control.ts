export class LaunchControl {
  private serverUrl: string;
  private lastSessionState: "start" | "end" | null;
  private trackingId: string;

  constructor(serverUrl: string, trackingId: string) {
    this.serverUrl = serverUrl;
    this.lastSessionState = null;
    this.trackingId = trackingId;
  }

  private sessionStart() {
    const lastSessionIsNullOrEnd =
      this.lastSessionState === null || this.lastSessionState === "end";

    if (!lastSessionIsNullOrEnd) return;

    this.sendSessionStartBeacon();
    this.lastSessionState = "start";

    console.log("session start");
  }

  private async extractSourceName(): Promise<string | null> {
    const url = new URL(window.location.href);
    const src = url.searchParams.get("src");
    window.history.replaceState({}, "", url.pathname);
    return src;
  }

  private async sendSessionStartBeacon() {
    const sourceName = await this.extractSourceName();

    const url = sourceName
      ? `${this.serverUrl}/session/start?source_name=${sourceName}`
      : `${this.serverUrl}/session/start`;

    await fetch(url, {
      method: "POST",
      keepalive: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-tracking-id": this.trackingId,
      },
      body: JSON.stringify({
        timestamp: Date.now() / 1000, // seconds
        pathname: window.location.pathname,
        title: document.title,
      }),
    });
  }

  private sessionEnd() {
    const lastSessionWasStart = this.lastSessionState === "start";

    if (!lastSessionWasStart) return;

    this.sendSessionEndBeacon();
    this.lastSessionState = "end";

    console.log("session end");
  }

  private async sendSessionEndBeacon() {
    await fetch(`${this.serverUrl}/session/end`, {
      method: "POST",
      keepalive: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: Date.now() / 1000, // seconds
      }),
    });
  }

  public initialize() {
    window.addEventListener("load", () => {
      this.sessionStart();
    });

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.sessionStart();
      } else if (document.visibilityState === "hidden") {
        this.sessionEnd();
      }
    });

    window.addEventListener("blur", () => {
      this.sessionEnd();
    });

    window.addEventListener("focus", () => {
      this.sessionStart();
    });
  }

  public async sendClickEvent(buttonLabel: string) {
    await fetch(`${this.serverUrl}/session/event`, {
      method: "POST",
      keepalive: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-tracking-id": this.trackingId,
      },
      body: JSON.stringify({
        type: "click",
        target: buttonLabel,
      }),
    });
  }
}
