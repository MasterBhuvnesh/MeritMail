import DiscordRPC from "discord-rpc";

const CLIENT_ID = "1428844411688849408";

let rpc: DiscordRPC.Client | null = null;
let isConnected = false;

export async function initDiscordRPC() {
  if (rpc) return;

  try {
    rpc = new DiscordRPC.Client({ transport: "ipc" });

    rpc.on("ready", () => {
      console.log("Discord RPC Connected");
      isConnected = true;
      setActivity();
    });

    rpc.on("disconnected", () => {
      console.log("Discord RPC Disconnected");
      isConnected = false;
    });

    await rpc.login({ clientId: CLIENT_ID });
  } catch (error) {
    console.error("Failed to initialize Discord RPC:", error);
    rpc = null;
  }
}

export function setActivity() {
  if (!rpc || !isConnected) return;

  try {
    rpc.setActivity({
      details: "Analyzing & automating",
      state: "Working",
      largeImageKey:
        "https://i.pinimg.com/1200x/2c/36/44/2c364466678be55dfacfe65c673844c1.jpg",
      largeImageText: "MeritMail",
      smallImageKey: "gdg",
      smallImageText: "GDG",
      instance: false,
      startTimestamp: Date.now(),
    });
  } catch (error) {
    console.error("Failed to set Discord activity:", error);
  }
}

export function destroyDiscordRPC() {
  if (rpc) {
    try {
      rpc.destroy();
    } catch (error) {
      console.error("Error destroying Discord RPC:", error);
    }
    rpc = null;
    isConnected = false;
  }
}

export function isDiscordConnected() {
  return isConnected;
}
