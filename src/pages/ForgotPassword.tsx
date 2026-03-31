import { RiInformationFill, RiMailFill } from "@remixicon/react";
import Input from "../components/shared/Input";
import Button from "../components/shared/Button";

const ForgotPassword = () => {
  return (
    <section className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 rounded-lg max-w-2xl flex flex-col items-start gap-2 font-[Inter]">
      <div className="flex items-center gap-2">
        <RiInformationFill color="#F48C25" />
        <p className="text-lg text-[#F48C25] font-semibold">Forgot Password?</p>
      </div>
      <p>
        Enter your email address, you will be sent a link to reset your password
        if your email has an account on GarageSwap.
      </p>
      <div className="flex items-center gap-2">
        <Input
          icon={<RiMailFill color="#F48C25" />}
          placeholder="Enter your email"
          name=""
        />
        <Button text="Send Email" btnBg="bg-[#F48C25]" textColor="text-white" />
      </div>
    </section>
  );
};

export default ForgotPassword;
