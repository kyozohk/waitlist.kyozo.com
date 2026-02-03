function WaitlistForm() {
  return (
    <div className="bg-[#494645] flex-[1_0_0] h-[2px] min-h-px min-w-px opacity-40 relative" data-name="WaitlistForm">
      <div aria-hidden="true" className="absolute border-2 border-[#494645] border-solid inset-[-1px] pointer-events-none" />
    </div>
  );
}

function WaitlistForm1() {
  return (
    <div className="bg-[#494645] h-[2px] opacity-40 relative w-full" data-name="WaitlistForm">
      <div aria-hidden="true" className="absolute border border-[#494645] border-solid inset-[-0.5px] pointer-events-none" />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative size-full">
      <WaitlistForm />
      <p className="css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#494645] text-[14px] text-center tracking-[-0.1504px] uppercase w-[44px]">Or</p>
      <div className="flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative">
        <div className="-scale-y-100 flex-none rotate-180 w-full">
          <WaitlistForm1 />
        </div>
      </div>
    </div>
  );
}