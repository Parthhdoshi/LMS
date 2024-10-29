export const SOCKET_ENDPOINT = process.env.NODE_ENV === "production" ?  process.env.NEXT_PUBLIC_LIVE_URL || "" : process.env.NEXT_PUBLIC_DEV_URL || ""
export const ENDPOINT = process.env.NODE_ENV === "production" ?  process.env.NEXT_PUBLIC_LIVE_URL || "" : process.env.NEXT_PUBLIC_DEV_URL || ""
