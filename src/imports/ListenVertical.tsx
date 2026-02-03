function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center not-italic relative shrink-0 text-center w-full">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#f7d47a] text-[36px] tracking-[-1px] w-full">
        <p className="css-4hzbpn leading-[28px]">Enter your passcode</p>
      </div>
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[15px] text-white tracking-[-0.2px] w-full">Kyozo operates a private invitation system for access to the platform in beta version. Please enter the passcode you were given to access the sign-up form.</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col h-[131px] items-center relative shrink-0 w-[563px]">
      <Frame1 />
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[60px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] py-[4px] relative size-full">
          <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[16px] tracking-[-0.1504px]">Enter your access code</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(79,73,73,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f7d47a] content-stretch flex h-[48px] items-center justify-center relative rounded-[10889662px] shrink-0 w-[180px]" data-name="Button">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-full justify-center leading-[0] not-italic relative shrink-0 text-[#494645] text-[18px] text-center tracking-[-0.36px] w-[94px]">
        <p className="css-4hzbpn leading-[20px]">Unlock</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center justify-center relative shrink-0 w-full">
      <Input />
      <Button />
    </div>
  );
}

export default function ListenVertical() {
  return (
    <div className="bg-[#494645] content-stretch flex flex-col gap-[12px] items-center justify-center p-[48px] relative rounded-[20px] size-full" data-name="Listen - Vertical">
      <Frame />
      <Frame2 />
    </div>
  );
}