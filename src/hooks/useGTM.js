import * as gtm from "../lib/gtm"; // adjust if you use aliases

const useGTM = () => {
  const sendEvent = (data) => {
    gtm.event(data);
  };
  const sendGTM = (data) => {
    gtm.GTMevent(data);
  };

  const sendPageView = (url) => {
    gtm.pageview(url);
  };

  return {
    sendEvent,
    sendGTM,
    sendPageView,
  };
};

export default useGTM;
