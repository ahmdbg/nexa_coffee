import { Outlet } from 'react-router-dom';
import { APP_TAGLINE } from '../constants';
import { NexaDeskLogo } from '../components/layout/NexaDeskLogo';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center text-center mb-8">
        <NexaDeskLogo />
        <p className="mt-2.5 text-[13px] text-[#64748B]">{APP_TAGLINE}</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] px-6 py-8 sm:px-8">
          <Outlet />
        </div>
        <p className="mt-6 text-center text-[12px] text-[#64748B]">
          Simulated local-first authentication for frontend demonstration. No credentials are sent to an external server.
        </p>
      </div>
    </div>
  );
}
