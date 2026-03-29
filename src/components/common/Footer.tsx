const socialLinks = ['VK', 'TG', 'YT', 'IN', 'GH'];

export const Footer = () => {
  return (
    <footer className="mt-8 text-[#8f8de0]">
      <div className="mx-auto max-w-[1108px] px-4 pb-14 sm:px-6 lg:px-8">
        <div className="border-t border-[var(--app-line)] pt-16">
          <div className="mx-auto grid max-w-[520px] gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <h3 className="text-[20px] text-[#9b9bf2]">Контакты:</h3>
              <ul className="mt-6 space-y-2 text-[16px]">
                <li><a href="mailto:info@tramplin.ru" className="transition-colors hover:text-white">Email</a></li>
                <li><a href="tel:+70000000000" className="transition-colors hover:text-white">Телефон</a></li>
                <li><a href="#legal" className="transition-colors hover:text-white">Юридический адрес</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-[20px] text-[#9b9bf2]">О нас:</h3>
              <ul className="mt-6 space-y-2 text-[16px]">
                <li><a href="#privacy" className="transition-colors hover:text-white">Политика конфиденциальности</a></li>
                <li><a href="#agreement" className="transition-colors hover:text-white">Пользовательское соглашение</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center justify-center">
            <div className="flex items-center gap-3">
              {socialLinks.map((label) => (
                <a
                  key={label}
                  href="#social"
                  aria-label={label}
                  className="h-7 w-7 rounded-[9px] bg-[#6c70ce] transition-transform hover:-translate-y-0.5"
                />
              ))}
            </div>
            <p className="mt-4 text-[16px] text-[#8f8de0]">Ищите нас здесь</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--app-surface)]">
        <div className="mx-auto flex max-w-[1108px] flex-wrap items-center justify-center gap-8 px-4 py-5 text-[15px] text-[#ecedff] sm:px-6 lg:px-8">
          <a href="/" className="transition-colors hover:text-white">Главная</a>
          <a href="/register" className="transition-colors hover:text-white">Регистрация</a>
          <a href="/login" className="transition-colors hover:text-white">Вход</a>
          <a href="#opportunities" className="transition-colors hover:text-white">Возможности</a>
        </div>
      </div>
    </footer>
  );
};
