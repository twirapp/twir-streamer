# Potat Streamer

It streams the 24/7 grafana for [TwirApp](https://twir.app)

## 🐳 Docker Compose

### 1. Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/) installed.
- [Bun](https://bun.sh/).
- Rename `streamer.example.conf` to `streamer.conf` and enter your stream url and stream keys.

### 2. Create Container

The `twir` Swarm overlay must already exist with `Attachable=true`. Set these fields in
`config.json` before starting the service:

```json
{
  "grafanaEnabled": true,
  "url": "http://twir_grafana:3000/d/twir-stream-overview/twir-live-overview?orgId=1&from=now-24h&to=now&timezone=browser&refresh=30s&kiosk&theme=dark",
  "grafanaUser": "twir-streamer",
  "grafanaPass": "stored viewer password"
}
```

Create `twir-streamer` as a Viewer in Grafana. Do not reuse the Grafana administrator account.
`config.json` and `cookies.json` are bind-mounted at runtime and excluded from the image build.
If `injectedCss` overrides Grafana panel headings for a 1920x1080 stream, keep them near `22px`;
larger headings reduce the plot and legend area inside every panel.

```sh
docker compose up -d --build
```

After changing Grafana or restarting the browser capture, verify the actual RTMP output rather than
only opening the dashboard in a browser:

```sh
docker compose exec streamer ffmpeg -hide_banner -loglevel error -y \
  -i rtmp://nginx:1935/live/potato -frames:v 1 /tmp/live-frame.png
docker cp twir-streamer-streamer-1:/tmp/live-frame.png /tmp/live-frame.png
```

- This will start the NGINX RTMP server and stunnel proxy.
- Build the NGINX RTMP image (with stunnel for Kick support).
- Copy your `streamer.conf` and `stunnel.conf` into the image.
- The RTMP server will listen on port `1935` (default RTMP port).
- The streamer joins the external `twir` overlay network and opens Grafana internally at
  `http://twir_grafana:3000`. Use the stack-qualified name because another stack also publishes
  the `grafana` alias on this network.
- Uses stunnel to stream to kick which requires rtmps, which nginx struggles with.
- The configuration will push your stream to Twitch, YouTube, and Kick.

## Start Streamer

```sh
bun i && bun start
```
