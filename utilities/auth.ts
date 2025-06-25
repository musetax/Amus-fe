import Cookies from "js-cookie";
import axios from "axios";

export const getAccessToken = (): string | undefined => Cookies.get("collintoken");
export const getRefreshToken = (): string | undefined => Cookies.get("collinrefresh");

export const setTokens = (accessToken: string, refreshToken?: string) => {
  Cookies.set("collintoken", accessToken);
  if (refreshToken) Cookies.set("collinrefresh", refreshToken);
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_API}v1/login/refresh`, {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data?.tokens?.AccessToken;
    const newRefreshToken = response.data?.tokens?.RefreshToken;

    if (newAccessToken) {
      setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    }
  } catch (err) {
    Cookies.remove("collintoken");
    Cookies.remove("collinrefresh");
    window.location.href = "/login"; // force re-login
  }

  return null;
};
