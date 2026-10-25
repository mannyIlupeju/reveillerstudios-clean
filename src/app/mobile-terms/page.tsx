import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile Terms of Service',
  description: 'The terms and conditions for Reveiller Studios SMS/text messaging program.',
  alternates: { canonical: 'https://www.reveillerstudios.com/mobile-terms' },
};

export default function MobileTermsOfService() {
  return (
    <main className="max-w-4xl mx-auto my-10 px-4 py-10 text-neutral-800">
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mobile Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">
            Reveiller Studios<br />
            Last updated: October 25, 2026
          </p>

          <div className="text-gray-700 space-y-4">
            <p>
              The Reveiller Studios mobile message service (the Service) is operated
              by Reveiller Studios (Reveiller Studios, we, or us). Your use of the
              Service constitutes your agreement to these terms and conditions
              (Mobile Terms). We may modify or cancel the Service or any of its features
              without notice. To the extent permitted by applicable law, we may also
              modify these Mobile Terms at any time, and your continued use of the
              Service following the effective date of any such changes shall constitute
              your acceptance of such changes.
            </p>

            <p>
              By consenting to Reveiller Studios SMS or text messaging service, you agree
              to receive recurring SMS or text messages from and on behalf of Reveiller
              Studios through your wireless provider to the mobile number you provided,
              even if your mobile number is registered on any state or federal Do Not
              Call list. Text messages may be sent using an automatic telephone dialing
              system or other technology. Messages may include promotions, specials, and
              other marketing offers such as cart reminders.
            </p>

            <p>
              You understand that you do not have to sign up for this program in order
              to make any purchases, and your consent is not a condition of any purchase
              with Reveiller Studios. Your participation in this program is completely
              voluntary.
            </p>

            <p>
              We do not charge for the Service, but you are responsible for all charges
              and fees associated with text messaging imposed by your wireless provider.
              Message frequency varies. Message and data rates may apply.
            </p>

            <p>
              You may opt out of the Service at any time. Text the single keyword command
              <strong> STOP </strong> to{' '}
              <a href="tel:+18335694052" className="text-blue-600 hover:underline">
                +1 (833) 569-4052
              </a>
              {' '}or click the unsubscribe link where available in any text message to
              cancel. You will receive a one time opt out confirmation text message. No
              further messages will be sent to your mobile device unless initiated by
              you. If you subscribe to other Reveiller Studios mobile programs, you must
              opt out separately from those programs as well.
            </p>

            <p>
              For Service support or assistance, send a request by email to{' '}
              <a
                href="mailto:contact@reveillerstudios.com"
                className="text-blue-600 hover:underline"
              >
                contact@reveillerstudios.com
              </a>.
            </p>

            <p>
              We may change any short code or phone number we use to operate the Service
              at any time. Any messages you send to a changed number may not be received,
              and we are not responsible for honoring requests sent to old numbers.
            </p>

            <p>
              Wireless carriers are not liable for delayed or undelivered messages. You
              agree to provide us with a valid mobile number. If you get a new mobile
              number, you must re enroll in the program.
            </p>

            <p>
              To the extent permitted by law, you agree that we will not be liable for
              failed, delayed, or misdirected delivery of any information sent through
              the Service, any errors in such information, and any action you may or may
              not take in reliance on the Service.
            </p>

            <p>
              We respect your privacy. To see how we collect and use your personal
              information, please review our{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </div>

          <footer className="text-center text-sm text-gray-500 mt-12 pt-6 border-t">
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
            {' · '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
