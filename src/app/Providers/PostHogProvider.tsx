'use client'

import { ReactNode, useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

export default function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!key) {
      return;
    }

    posthog.init(key, {
      api_host: host || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      // Pageviews are captured manually in PostHogPageView so App Router
      // client-side navigations (which don't trigger a full page load) are tracked.
      capture_pageview: false,
      capture_pageleave: true,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
