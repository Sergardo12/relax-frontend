import { AuthContainer } from "@/components/layouts/AuthContainer";

export default function AuthLayout({children}: {children: React.ReactNode}) {
    return <AuthContainer>{children}</AuthContainer>
}
