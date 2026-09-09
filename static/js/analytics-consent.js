const GA_MEASUREMENT_ID = 'G-Q2NYS0XQ7M';
const CONSENT_STORAGE_KEY = 'analyticsConsent';

window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}


/* =========================================================
   1. Set consent BEFORE loading Google Analytics
========================================================= */

const savedConsent =
  localStorage.getItem(CONSENT_STORAGE_KEY);

gtag('consent', 'default', {
  analytics_storage:
    savedConsent === 'accepted'
      ? 'granted'
      : 'denied',

  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',

  wait_for_update: 500
});


/* =========================================================
   2. Load Google Analytics on every visit

   If analytics_storage is denied:
   -> no Analytics cookies
   -> cookieless pings only

   If granted:
   -> normal Analytics measurement
========================================================= */

function loadGoogleAnalytics() {
  if (window.gaLoaded) return;

  window.gaLoaded = true;

  const script =
    document.createElement('script');

  script.async = true;

  script.src =
    'https://www.googletagmanager.com/gtag/js?id=' +
    GA_MEASUREMENT_ID;

  document.head.appendChild(script);

  gtag('js', new Date());

  gtag('config', GA_MEASUREMENT_ID);
}

loadGoogleAnalytics();


/* =========================================================
   3. Consent actions
========================================================= */

function acceptAnalytics() {
  localStorage.setItem(
    CONSENT_STORAGE_KEY,
    'accepted'
  );

  gtag('consent', 'update', {
    analytics_storage: 'granted',

    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  hideAnalyticsConsentBanner();
}


function rejectAnalytics() {
  localStorage.setItem(
    CONSENT_STORAGE_KEY,
    'rejected'
  );

  gtag('consent', 'update', {
    analytics_storage: 'denied',

    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  hideAnalyticsConsentBanner();
}


/* =========================================================
   4. Banner
========================================================= */

function hideAnalyticsConsentBanner() {
  const banner =
    document.getElementById(
      'analytics-consent-banner'
    );

  if (banner) {
    banner.style.display = 'none';
  }
}


function showAnalyticsConsentBanner() {
  const banner =
    document.getElementById(
      'analytics-consent-banner'
    );

  if (banner) {
    banner.style.display = 'flex';
  }
}


document.addEventListener(
  'DOMContentLoaded',
  function () {
    if (!savedConsent) {
      showAnalyticsConsentBanner();
    }
  }
);