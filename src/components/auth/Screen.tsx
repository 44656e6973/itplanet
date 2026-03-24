import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const Element = () => {
  const [activeRole, setActiveRole] = useState<"soiskatel" | "rabotodatel">(
    "soiskatel",
  );

  return (
    <div className="bg-[#151424] w-full min-w-[1600px] min-h-[900px] flex">
      {/* Left form section */}
      <div className="flex flex-col w-[898px] min-w-[898px] px-[205px] pt-[116px] pb-[100px]">
        {/* Title */}
        <h1 className="text-[#eafffb] text-4xl [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal] mb-[67px]">
          Регистрация
        </h1>

        {/* Role toggle buttons */}
        <div className="flex flex-row gap-0 mb-[74px]">
          <button
            onClick={() => setActiveRole("soiskatel")}
            className={`w-[200px] h-[51px] rounded-[15px] text-[22px] [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal] transition-colors ${
              activeRole === "soiskatel"
                ? "bg-[#2d2a63] text-[#7881aa]"
                : "bg-[#eafffb] text-[#2d2a63]"
            }`}
          >
            Соискатель
          </button>
          <button
            onClick={() => setActiveRole("rabotodatel")}
            className={`w-[200px] h-[51px] rounded-[15px] text-[22px] [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal] transition-colors ${
              activeRole === "rabotodatel"
                ? "bg-[#2d2a63] text-[#7881aa]"
                : "bg-[#eafffb] text-[#2d2a63]"
            }`}
          >
            Работадатель
          </button>
        </div>

        {/* Логин field */}
        <div className="flex flex-col gap-[6px] mb-[42px]">
          <Label className="text-[#eafffb] text-[22px] [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal]">
            Логин
          </Label>
          <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
            <Input
              className="bg-transparent border-none shadow-none text-[#8989c9] text-xl [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal] placeholder:text-[#8989c9] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              placeholder="Ввод"
            />
          </div>
        </div>

        {/* Имя пользователя field */}
        <div className="flex flex-col gap-[6px] mb-[42px]">
          <Label className="text-[#eafffb] text-[22px] [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal]">
            Имя пользователя
          </Label>
          <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
            <Input
              className="bg-transparent border-none shadow-none text-[#8989c9] text-xl [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal] placeholder:text-[#8989c9] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              placeholder="Ввод"
            />
          </div>
        </div>

        {/* Пароль field */}
        <div className="flex flex-col gap-[6px] mb-[42px]">
          <Label className="text-[#eafffb] text-[22px] [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal]">
            Пароль
          </Label>
          <div className="w-[415px] h-[51px] bg-[#eafffb] rounded-[15px] flex items-center px-[14px]">
            <Input
              type="password"
              className="bg-transparent border-none shadow-none text-[#8989c9] text-xl [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal] placeholder:text-[#8989c9] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              placeholder="Ввод"
            />
          </div>
        </div>

        {/* Далее button */}
        <Button
          className="w-[415px] h-[41px] bg-[#eafffb] rounded-[15px] text-[#2d2a63] text-[22px] [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal] hover:bg-[#d0f5ee] mb-[37px]"
          h-auto
        >
          Далее
        </Button>

        {/* Already have account */}
        <div className="flex flex-col gap-0">
          <p className="text-[#d9d9d9] text-base [font-family:'Inter',Helvetica] font-normal tracking-[0] leading-[normal] whitespace-nowrap">
            Уже есть аккаунт?{" "}
            <span className="text-[#d9d9d9] underline cursor-pointer">
              Войти
            </span>
          </p>
        </div>
      </div>

      {/* Right mint background section */}
      <div className="flex-1 bg-[#eafffb]" />
    </div>
  );
};
