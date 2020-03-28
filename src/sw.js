import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);
precacheAndRoute(["https://unpkg.com/systemjs@2.0.0/dist/s.min.js"]);
