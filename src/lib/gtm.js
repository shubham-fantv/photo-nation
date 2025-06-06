import { trackEvent } from "../../mixpanelClient";
// lib/gtm.js
export const GTM_ID = "GTM-M66VXNTL";

export const pageview = (url) => {
  window.dataLayer?.push({
    event: "pageViewedPN",
    page_path: url,
  });
};

export const event = ({ event, ...rest }) => {
  trackEvent(event, { ...rest, app_id: "photonation" });
};

export const GTMevent = ({ event, ...rest }) => {
  window.dataLayer?.push({
    event,
    app_id: "photonation",
    ...rest,
  });
};
