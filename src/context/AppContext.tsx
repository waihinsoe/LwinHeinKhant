import { config } from "@/config/config";
import { Users } from "@prisma/client";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";

interface AppContextType {
  isLoading: boolean;
  accountOwner: Users | null;
  setAppData: (value: any) => void;
  fetchData: () => void;
}

export const defaultContext: AppContextType = {
  isLoading: true,
  accountOwner: null,
  setAppData: () => {},
  fetchData: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContext);

interface Props {
  children: ReactNode;
}

export const AppProvider = ({ children }: Props) => {
  const router = useRouter();
  const [appData, setAppData] = useState(defaultContext);
  const accessToken =
    typeof window !== "undefined" && localStorage.getItem("accessToken");

  const fetchData = async () => {
    if (!accessToken) return router.push("/signIn");

    const response = await fetch(`${config.apiBaseUrl}/app`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const responseJson = await response.json();
      setAppData({ ...setAppData, ...responseJson, isLoading: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);
  return (
    <AppContext.Provider value={{ ...appData, setAppData, fetchData }}>
      {children}
    </AppContext.Provider>
  );
};
