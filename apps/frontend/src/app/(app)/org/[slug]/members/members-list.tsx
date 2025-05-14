import { ability, getCurrentOrganization } from "@/auth/auth";
import { getMembers } from "@/https/get-members";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { GetMembership } from "@/https/get-membership";
import { GetOrganization } from "@/https/get-organization";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftRight, Crown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { organizationSchema } from "@saas/auth";
import Image from "next/image";
import { removeMemberAction } from "./actions";

export async function MembersList() {
	const currentOrg = await getCurrentOrganization()
	const permissions = await ability()


	const [{ membership }, { members }, { organization }] = await Promise.all([
		GetMembership(currentOrg!),
		getMembers(currentOrg!),
		GetOrganization(currentOrg!),
	])

	const authOrganization = organizationSchema.parse(organization)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Members</CardTitle>
				<CardDescription>
					List all memebrs of this organization
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableBody>
						{members.map((member) => {
							return (
								<TableRow key={member.id}>
									<TableCell className="py-2.5" style={{ width: 48 }}>
										<Avatar>
											<AvatarFallback />
											{member.avatarUrl && (
												<Image
													src={member.avatarUrl}
													width={32}
													height={32}
													alt={member.name!}
													className="aspect-square size-full"
												/>
											)}
										</Avatar>
									</TableCell>
									<TableCell className="py-2.5">
										<div className="flex flex-col">
											<span className="inline-flex items-center gap-2 font-medium">
												{member.name}
												{member.userId === membership.userId && ' (me)'}
												{organization.ownerId === member.userId && (
													<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
														<Crown className="size-3" />
														Owner
													</span>
												)}
											</span>
											<span className="text-xs text-muted-foreground">
												{member.email}
											</span>
										</div>
									</TableCell>
									<TableCell className="py-2.5 ">
										<div className="flex items-center justify-end gap-2">
											{permissions?.can(
												'transfer_owership',
												authOrganization,
											) && (
													<Button size="sm" variant="outline" className="hover:cursor-pointer">
														<ArrowLeftRight className="mr-2 size-4" />
														Transfer ownership
													</Button>
												)
											}

											{permissions?.can("delete", "User") && (
												<form action={removeMemberAction.bind(null, member.id)}>
													<Button disabled={member.userId === membership.userId || member.userId === organization.ownerId} type='submit' size="sm" variant="destructive">
														<User className="mr-2 size-4" />
														Remove
													</Button>
												</form>
											)}

										</div>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}