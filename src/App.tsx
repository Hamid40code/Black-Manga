import templeImage from './assets/Temple.jpg';
import AccountSetupFlow from './components/auth/AccountSetupFlow';

function MoonMark() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-100/30 bg-white/[0.06] shadow-[0_0_28px_rgba(238,190,119,0.12)]">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-amber-100">
        <path
          d="M18.8 15.8A8.2 8.2 0 0 1 8.2 5.2 8.4 8.4 0 1 0 18.8 15.8Z"
          fill="currentColor"
          fillOpacity=".9"
        />
        <path
          d="m17.7 4.2.45 1.25 1.25.45-1.25.45-.45 1.25-.45-1.25L16 5.9l1.25-.45.45-1.25Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default function App() {
  return (
    <main className="relative isolate min-h-[100svh] overflow-hidden bg-[#090a0d] text-white">
      <img
        src={templeImage}
        alt="Moonlit temple landscape with red autumn trees and mountains"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.16)_100%)]"
      />

      <div className="flex min-h-[100svh] items-center justify-center px-4 py-4 sm:px-6 sm:py-6">
        <section className="w-full max-w-[410px]">
          <div className="relative overflow-hidden rounded-[26px] border border-white/20 bg-[#111318]/65 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-md sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
            />
            <div className="relative mb-5 flex justify-center">
              <MoonMark />
            </div>
            <AccountSetupFlow />
          </div>
        </section>
      </div>
    </main>
  );
}
