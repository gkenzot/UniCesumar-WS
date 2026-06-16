import { assetUrl } from "./lib/assetUrl.js";

const root = document.documentElement;

root.style.setProperty(
  "--studeo-font-regular-woff",
  `url(${assetUrl("studeo/fonts/studeo-regular.e1a3d85f.woff")})`,
);
root.style.setProperty(
  "--studeo-font-regular-ttf",
  `url(${assetUrl("studeo/fonts/studeo-regular.792984dc.ttf")})`,
);
root.style.setProperty(
  "--studeo-font-bold-woff",
  `url(${assetUrl("studeo/fonts/studeo-semibold.a5d4c544.woff")})`,
);
root.style.setProperty(
  "--studeo-font-bold-ttf",
  `url(${assetUrl("studeo/fonts/studeo-semibold.5dee89b6.ttf")})`,
);
root.style.setProperty(
  "--studeo-bg-home",
  `url(${assetUrl("studeo/main-home-studeo.webp")})`,
);
root.style.setProperty(
  "--studeo-logo",
  `url(${assetUrl("studeo/uni-logo-studeo.webp")})`,
);
