import Script from 'next/script';
import React from 'react';
import Head from 'next/head';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Privacy page',
};


export default function Privacy() {

  <Head>
  <title>Privacy- Reveiller Studios</title>
  <meta name="description" content="Privacy Policy Reveillerstudios" />
  <meta name="keywords" content="privacy policy, cookie policy, Reveillerstudios, reveillerstudios" />
 </Head>

  return (
    <main className="max-w-4xl mx-auto my-10 px-4 py-10 text-neutral-800 h-[80vh] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-4">Please click the link to view our Privacy and Cookie policy</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: {new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',          
        day: 'numeric',   
      })}</p> 
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Owner and Data Controller</h2>
          <div className="text-gray-700 space-y-2">
            <p><strong>Reveillerstudios</strong></p>
            <p>686 Toronto street, Winnipeg, MB</p>
            <p>Owner contact email: <a href="mailto:reveillerstudios@outlook.com" className="text-blue-600 hover:underline">reveillerstudios@outlook.com</a></p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Type of Data We Collect</h2>
          <div className="text-gray-700 space-y-4">
            <p>The owner does not provide a list of Personal Data types collected.</p>
            <p>Complete details on each type of Personal Data collected are provided in the dedicated sections of this privacy policy or by specific explanation texts displayed prior to the Data collection. Personal Data may be freely provided by the User, or, in case of Usage Data, collected automatically when using this Application.</p>
            <p>Unless specified otherwise, all Data requested by this Application is mandatory and failure to provide this Data may make it impossible for this Application to provide its services. In cases where this Application specifically states that some Data is not mandatory, Users are free not to communicate this Data without consequences to the availability or the functioning of the Service.</p>
            <p>Users who are uncertain about which Personal Data is mandatory are welcome to contact the Owner.</p>
            <p>Any use of Cookies or of other tracking tools by this Application or by the owners of third-party services used by this Application serves the purpose of providing the Service required by the User, in addition to any other purposes described in the present document and in the Cookie Policy.</p>
            <p>Users are responsible for any third-party Personal Data obtained, published or shared through this Application.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mode and Place of Processing the Data</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Methods of Processing</h3>
          <div className="text-gray-700 space-y-4">
            <p>The Owner takes appropriate security measures to prevent unauthorized access, disclosure, modification, or unauthorized destruction of the Data.</p>
            <p>The Data processing is carried out using computers and/or IT enabled tools, following organizational procedures and modes strictly related to the purposes indicated. In addition to the Owner, in some cases, the Data may be accessible to certain types of persons in charge, involved with the operation of this Application (administration, sales, marketing, legal, system administration) or external parties (such as third-party technical service providers, mail carriers, hosting providers, IT companies, communications agencies) appointed, if necessary, as Data Processors by the Owner. The updated list of these parties may be requested from the Owner at any time.</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Place</h3>
          <div className="text-gray-700 space-y-4">
            <p>The Data is processed at the Owners operating offices and in any other places where the parties involved in the processing are located.</p>
            <p>Depending on the Users location, data transfers may involve transferring the Users Data to a country other than their own. To find out more about the place of processing of such transferred Data, Users can check the section containing details about the processing of Personal Data.</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Retention Time</h3>
          <p className="text-gray-700">Unless specified otherwise in this document, Personal Data shall be processed and stored for as long as required by the purpose they have been collected for and may be retained for longer due to applicable legal obligation or based on the Users consent.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookie Policy</h2>
          <p className="text-gray-700">This Application uses Trackers. To learn more, Users may consult the Cookie Policy.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Further Information for Users in the European Union</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Legal Basis of Processing</h3>
          <div className="text-gray-700 space-y-4">
            <p>The Owner may process Personal Data relating to Users if one of the following applies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users have given their consent for one or more specific purposes.</li>
              <li>Provision of Data is necessary for the performance of an agreement with the User and/or for any pre-contractual obligations thereof;</li>
              <li>Processing is necessary for compliance with a legal obligation to which the Owner is subject;</li>
              <li>Processing is related to a task that is carried out in the public interest or in the exercise of official authority vested in the Owner;</li>
              <li>Processing is necessary for the purposes of the legitimate interests pursued by the Owner or by a third party.</li>
            </ul>
            <p>In any case, the Owner will gladly help to clarify the specific legal basis that applies to the processing, and in particular whether the provision of Personal Data is a statutory or contractual requirement, or a requirement necessary to enter into a contract.</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Further Information About Retention Time</h3>
          <div className="text-gray-700 space-y-4">
            <p>Unless specified otherwise in this document, Personal Data shall be processed and stored for as long as required by the purpose they have been collected for and may be retained for longer due to applicable legal obligation or based on the Users consent.</p>
            <p>Therefore:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal Data collected for purposes related to the performance of a contract between the Owner and the User shall be retained until such contract has been fully performed.</li>
              <li>Personal Data collected for the purposes of the Owners legitimate interests shall be retained as long as needed to fulfill such purposes. Users may find specific information regarding the legitimate interests pursued by the Owner within the relevant sections of this document or by contacting the Owner.</li>
            </ul>
            <p>The Owner may be allowed to retain Personal Data for a longer period whenever the User has given consent to such processing, as long as such consent is not withdrawn. Furthermore, the Owner may be obliged to retain Personal Data for a longer period whenever required to fulfil a legal obligation or upon order of an authority.</p>
            <p>Once the retention period expires, Personal Data shall be deleted. Therefore, the right of access, the right to erasure, the right to rectification and the right to data portability cannot be enforced after expiration of the retention period.</p>
          </div>
        </section>

       <section className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Definitions and Legal References
      </h2>

      <div className="text-gray-700 space-y-6">

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Personal Data (or Data)
          </h3>
          <p>
            Any information that directly, indirectly, or in connection with other
            information - including a personal identification number - allows
            for the identification or identifiability of a natural person.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Usage Data
          </h3>
         <p>
          Information collected automatically through this Application (or
          third-party services employed in this Application), which can include:
          the IP addresses or domain names of the computers utilized by the Users
          who use this Application, the URI addresses (Uniform Resource
          Identifier), the time of the request, the method used to submit the
          request to the server, the size of the file received in response, the
          numerical code indicating the status of the servers answer (successful
          outcome, error, etc.), the country of origin, the features of the
          browser and the operating system used by the User, the various time
          details per visit (e.g., time spent on each page within the
          Application), the details about the path followed within the
          Application, and other parameters about the device operating system and
          the Users IT environment.
        </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">User</h3>
          <p>
            The individual using this Application who, unless otherwise specified,
            coincides with the Data Subject.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Subject</h3>
          <p>The natural person to whom the Personal Data refers.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Data Processor (or Processor)
          </h3>
          <p>
            The natural or legal person, public authority, agency or other body
            which processes Personal Data on behalf of the Controller, as described
            in this privacy policy.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Data Controller (or Owner)
          </h3>
          <p>
            The natural or legal person, public authority, agency or other body
            which, alone or jointly with others, determines the purposes and means
            of the processing of Personal Data, including the security measures
            concerning the operation and use of this Application. The Data
            Controller, unless otherwise specified, is the Owner of this Application.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            This Application
          </h3>
          <p>
            The means by which the Personal Data of the User is collected and
            processed.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Service</h3>
          <p>
            The service provided by this Application as described in the relative
            terms (if available) and on this site or application.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            European Union (or EU)
          </h3>
          <p>
            Unless otherwise specified, all references made within this document to
            the European Union include all current member states of the European
            Union and the European Economic Area.
          </p>
        </div>

        </div>
        </section>

        <section className="mb-8 pb-4 border-t pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Legal Information
          </h2>
          <p className="text-gray-700">
            This privacy policy relates solely to this Application, if not stated
            otherwise within this document.
          </p>
        </section>

        <section className="mb-8 pb-4 border-t pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Mobile Terms of Service
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            Reveiller Studios<br />
            Last updated: Nov. 18, 2025
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
      system or other technology. Promotional messages may include promotions,
      specials, and other marketing offers such as cart reminders.
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
      <strong> STOP </strong> to 
      <a href="tel:+18335694052" className="text-blue-600 hover:underline">
        +1 (833) 569-4052
      </a>
      or click the unsubscribe link where available in any text message to
      cancel. You will receive a one time opt out confirmation text message. No
      further messages will be sent to your mobile device unless initiated by
      you. If you subscribe to other Reveiller Studios mobile programs, you must
      opt out separately from those programs as well.
    </p>

    <p>
      For Service support or assistance, send a request by email to 
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
      information, please review our Privacy Notice.
    </p>


      </div>
     </section>

        <footer className="text-center text-sm text-gray-500 mt-12 pt-6 border-t">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
    </main>
  );
}

