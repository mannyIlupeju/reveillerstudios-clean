import Link from 'next/link';

/**
 * Single source of truth for the SMS consent wording shown under the phone
 * field. The text matches the notice in the live Klaviyo popup, so every
 * signup surface presents the same consent language.
 */
export const SMS_CONSENT_TEXT =
  'By providing your phone number, you consent to receive recurring marketing text messages (such as promotions and cart reminders) from Reveiller Studios, including texts sent by autodialer. Consent is not a condition of purchase. Msg & data rates may apply. Msg frequency varies. Reply STOP to opt out at any time.';

type SmsConsentProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export default function SmsConsent({ id, checked, onChange, className = 'text-xs' }: SmsConsentProps) {
  return (
    <div className="flex justify-start gap-2 mt-2">
      <input
        type="checkbox"
        id={id}
        name="smsConsent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        value="smsConsent"
      />
      <label htmlFor={id} className={`${className} leading-snug`}>
        {SMS_CONSENT_TEXT}{' '}
        <Link href="/privacy" target="_blank" className="underline">
          Privacy Policy
        </Link>{' '}
        &amp;{' '}
        <Link href="/mobile-terms" target="_blank" className="underline">
          Mobile Terms
        </Link>
        .
      </label>
    </div>
  );
}
