"use client";

import type { RecentlyModel } from "@mx-space/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SiteConfig } from "@/config";
import { motion } from "framer-motion";
import { Clock, MessageCircle } from "lucide-react";
import React from "react";

interface RecentliesProps {
	Recentlies: RecentlyModel[];
}

export const TimelineRecentlyLayout: React.FC<RecentliesProps> = ({ Recentlies }) => {
	return (
		<div className="ml-24 ontainer mx-auto px-4 py-8 max-w-4xl">
			<motion.h1
				className="text-4xl font-bold mb-8"
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<mark className="line">动态</mark>
			</motion.h1>
			<div className="relative">
				{/* Timeline line */}
				<div className="absolute left-0 w-0.5 h-full bg-gray-200" />

				{Recentlies.map((recently, index) => (
					<motion.div
						key={recently.id}
						className="mb-8 flex items-start w-full relative pl-8"
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
					>
						<div className="w-full">
							<Card className="w-full">
								<CardHeader>
									<div className="flex items-center space-x-4">
										<Avatar>
											<AvatarImage src="/avatar.png" alt={SiteConfig.master} />
											<AvatarFallback>{SiteConfig.master[0]}</AvatarFallback>
										</Avatar>
										<div>
											<p className="text-sm font-medium">{SiteConfig.master}</p>
											<p className="text-xs text-muted-foreground">
												<Clock className="inline-block w-3 h-3 mr-1" />
												{new Date(recently.created).toLocaleString()}
											</p>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div
										className="prose max-w-none"
										dangerouslySetInnerHTML={{ __html: recently.content }}
									/>
								</CardContent>
								<Separator className="my-2" />
								<CardFooter className="text-sm text-muted-foreground">
									<MessageCircle className="w-4 h-4 mr-2" />
									<span>
										ID:
										{recently.id}
									</span>
								</CardFooter>
							</Card>
						</div>
						{/* Timeline dot */}
						<div className="absolute left-0 top-6 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full" />
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default TimelineRecentlyLayout;