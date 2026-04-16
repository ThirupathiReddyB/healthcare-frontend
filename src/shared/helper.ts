import { useEffect, useState } from "react";

export function getInitials(fullName: string) {
  if (!fullName) return "";
  const names = fullName.split(" ");
  const initials = names[0][0] + (names[1] ? names[1][0] : "");
  return initials.toUpperCase();
}
export function formatDateComplaintFeedback(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatLanguage(language: string) {
  if (language === "en") {
    return "English";
  } else if (language === "hn") {
    return "Hindi";
  } else {
    return "Marathi";
  }
}

export const truncateCharacters = (text: string, charLimit: number): string => {
  if (text?.length > charLimit) {
    return text.slice(0, charLimit) + "...";
  }

  return text;
};


export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const updateOnlineStatus = () => {
    setIsOnline(navigator.onLine);
  };

  // Calling updateOnlineStatus on mount to get the current status
  useEffect(() => {
    updateOnlineStatus();
  }, []);

  useEffect(() => {

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return { isOnline };
}

/**
 * Function to captialize first letter of the word
 */
export const capitalizeWord = (value: string) => {
  return value
    .split(" ")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
};



