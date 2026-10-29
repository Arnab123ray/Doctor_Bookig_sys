import { useEffect, useState } from "react";

function DateTimeBar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="datetime-bar">
      <div className="datetime-inner">
        <span className="datetime-date">
          <span>📅</span> {date}
        </span>

        <span className="datetime-time">
          <span className="live-dot"></span>
          <span>🕒</span> {time}
        </span>
      </div>
    </div>
  );
}

export default DateTimeBar;