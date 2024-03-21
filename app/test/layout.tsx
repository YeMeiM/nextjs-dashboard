import {Metadata} from "next";

export const metadata: Metadata = {
  title: '测试'
}

export default function Layout({children}: { children: React.ReactNode }) {
  return <div className="h-screen flex items-center justify-center">
    {children}
  </div>
}