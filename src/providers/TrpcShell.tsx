import type { ReactNode } from "react";
import { TRPCProvider } from "./trpc";

/** Lazily-loaded wrapper: pulls the tRPC/react-query stack only into the
 *  chunks (admin, login, checkout) that actually need it. */
export default function TrpcShell({ children }: { children: ReactNode }) {
  return <TRPCProvider>{children}</TRPCProvider>;
}
