import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type UserRole = "applicant" | "employer";

export const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("applicant");
  const [login, setLogin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ role, login, username, password });
  };

  return (
    <div className="flex min-h-screen bg-[#1a1a2e]">
      {/* Left Panel - Form */}
      <div className="w-1/2 px-16 py-20 flex flex-col justify-start">
        <h1 className="text-white text-[32px] font-normal mb-8 mt-8">
          Регистрация
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
          {/* Role Selector */}
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={() => setRole("applicant")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 
                ${
                  role === "applicant"
                    ? "bg-[#eaffff] text-[#1a1a2e]"
                    : "bg-[#2d2d5a] text-white"
                }`}
            >
              Соискатель
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 
                ${
                  role === "employer"
                    ? "bg-[#eaffff] text-[#1a1a2e]"
                    : "bg-[#2d2d5a] text-white"
                }`}
            >
              Работодатель
            </button>
          </div>

          {/* Login Field */}
          <div className="mb-6">
            <label className="block text-white text-sm font-normal mb-2">
              Логин
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Ввод"
              className="w-full px-4 py-3 rounded-xl bg-[#eaffff] text-[#1a1a2e] text-sm outline-none border-2 border-transparent focus:border-[#4a4e69] placeholder:text-[#8a8aa8]"
            />
          </div>

          {/* Username Field */}
          <div className="mb-6">
            <label className="block text-white text-sm font-normal mb-2">
              Имя пользователя
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ввод"
              className="w-full px-4 py-3 rounded-xl bg-[#eaffff] text-[#1a1a2e] text-sm outline-none border-2 border-transparent focus:border-[#4a4e69] placeholder:text-[#8a8aa8]"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-white text-sm font-normal mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ввод"
              className="w-full px-4 py-3 rounded-xl bg-[#eaffff] text-[#1a1a2e] text-sm outline-none border-2 border-transparent focus:border-[#4a4e69] placeholder:text-[#8a8aa8]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-8 rounded-xl bg-[#eaffff] text-[#1a1a2e] text-sm font-medium transition-all duration-300 hover:opacity-90"
          >
            Регистрация
          </button>

          {/* Login Link */}
          <div className="mt-6 text-left">
            <span className="text-white text-xs">Уже есть аккаунт? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-white text-xs underline hover:text-[#eaffff]"
            >
              Войти
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-[#eaffff]" />
    </div>
  );
};