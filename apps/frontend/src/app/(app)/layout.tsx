import { isAuthenticated } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
	children,
	parallelRoutes
}: Readonly<{
	children: React.ReactNode,
	parallelRoutes: React.ReactNode
}>) {

	if (!(await isAuthenticated())) {
		redirect("/auth/sign-in");
	}


	return (
		<>
			{children}
			{parallelRoutes}
		</>
	)
}
