import { useRef, useEffect } from "react";

const TelegramLoginButton = ({ className }: { className: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current === null) return;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "TGSignalerBot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "0");
    script.setAttribute("data-request-access", "write");

    script.setAttribute(
      "data-auth-url",
      "https://1284-89-39-107-199.ngrok-free.app/"
    );
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return <div id="telegram" ref={ref} className={className} />;
};

export default TelegramLoginButton;
