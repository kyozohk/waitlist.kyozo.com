function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-h-px min-w-px not-italic relative text-center w-full">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] min-w-full relative shrink-0 text-[#4f4949] text-[36px] tracking-[-1px] w-[min-content]">
        <p className="css-4hzbpn leading-[28px]">Waitlist request</p>
      </div>
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#504c4c] text-[16px] tracking-[-0.5px] w-[486px]">{`If you'd like to leave us your name and email to request consideration as part of our waitlist, input it here.`}</p>
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

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[14px] not-italic relative shrink-0 text-[#4f4949] text-[13px] tracking-[-0.1504px]">Full Name</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[60px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[4px] relative size-full">
          <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] tracking-[-0.1504px]">Enter your name</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(79,73,73,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Input />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[14px] not-italic relative shrink-0 text-[#4f4949] text-[13px] tracking-[-0.1504px]">Email Address</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[60px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[4px] relative size-full">
          <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] tracking-[-0.1504px]">And your email</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(79,73,73,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel1 />
      <Input1 />
    </div>
  );
}

function PrimitiveLabel2() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[14px] not-italic relative shrink-0 text-[#4f4949] text-[13px] tracking-[-0.1504px]">Creative work</p>
    </div>
  );
}

function Textarea() {
  return (
    <div className="bg-white h-[150px] relative rounded-[12px] shrink-0 w-full" data-name="Textarea">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[16px] py-[4px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[45px] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[14px] tracking-[-0.1504px] w-[488px]">
            <p className="css-4hzbpn leading-[20px]">And we’d love to hear a bit more about your creative work....</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(4,139,154,0.3)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel2 />
      <Textarea />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[38px] items-start relative shrink-0 w-full">
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#4f4949] content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[999px] shrink-0 w-[180px]" data-name="Button">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-full justify-center leading-[0] not-italic relative shrink-0 text-[#f5f1e8] text-[18px] text-center tracking-[-0.36px] w-[129px]">
        <p className="css-4hzbpn leading-[20px]">Submit request</p>
      </div>
    </div>
  );
}

function WaitlistForm() {
  return (
    <div className="content-stretch flex flex-col gap-[50px] items-center relative shrink-0 w-full" data-name="WaitlistForm">
      <Frame2 />
      <Button />
    </div>
  );
}

export default function ListenVertical() {
  return (
    <div className="bg-[#f5f1e8] content-stretch flex flex-col gap-[12px] items-center justify-center p-[48px] relative rounded-[20px] size-full" data-name="Listen - Vertical">
      <Frame />
      <WaitlistForm />
    </div>
  );
}