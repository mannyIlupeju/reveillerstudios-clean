import React from 'react';

export default function ShippingAndReturns() {
  return (
    <section className="max-w-4xl mx-auto my-10 px-4 py-10 text-neutral-800 ">
      <div className="shipping-policy mb-12">
        <h2 className="text-2xl font-bold mb-6">Shipping &amp; Return Policy</h2>

        <h3 className="text-lg font-semibold mt-6 mb-2">Local Shipping</h3>
        <p className="mb-2">We offer local shipping exclusively to <strong>Winnipeg &amp; Toronto</strong>.</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Standard Items:</strong> 8–9 business days</li>
          <li><strong>Cut &amp; Sew Products:</strong> 2–4 weeks</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-2">International Shipping</h3>
        <p className="mb-2">
          Carriers include DHL Worldwide, FedEx International, UPS International,
          Royal Mail (UK), or DPD Standard (Europe). We ship to most countries
          worldwide <strong>excluding</strong> Cuba, Iran, Indonesia, North Korea,
          Syria, Ukraine, Russia, Venezuela, and Belarus.
        </p>
        <p className="mb-4">
          Applicable duties and import taxes are calculated at checkout. Once your
          package arrives in the destination country, Reveiller Studios is no
          longer responsible for delays, mishandling, customs procedures, or
          additional fees. Please contact your local postal or customs office for
          assistance.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Customs &amp; Import Fees</h3>
        <p className="mb-4">
          The recipient is responsible for all customs fees, taxes, and brokerage
          charges. You may be required to sign forms before delivery. If a package
          is seized by customs and returned unopened, you may request a refund on
          the merchandise only.
        </p>
      </div>

      <div className="return-policy mb-8">
        <h2 className="text-2xl font-bold mb-6">Return Policy</h2>

        <p className="mb-4">We accept returns on full‑price items purchased online only. Returns must be initiated within 30 days of delivery.</p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Policy Exclusions</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Sale, promotional, or discounted items</li>
          <li>Products made to a customer’s personal measurements</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-2">Return Process</h3>
        <ol className="list-decimal pl-6 mb-4">
          <li>
            <strong>Request Authorization:</strong> Email <a href="mailto:reveillerstudios@outlook.com">reveillerstudios@outlook.com</a> with your order number and reason for return.
          </li>
          <li>
            <strong>Ship Back:</strong> Once approved, ship the item back at your expense.
          </li>
          <li>
            <strong>Inspection &amp; Refund:</strong> After inspection, we’ll refund the item cost (minus original shipping and any customs fees) within 5–7 business days.
          </li>
        </ol>

        <p className="mb-4">
          Original shipping charges and any import/customs fees are non‑refundable.
          Refusal or return of international shipments does not entitle you to
          a refund of shipping or local fees.
        </p>
      </div>
    </section>
  );
}
