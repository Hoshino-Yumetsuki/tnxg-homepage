"use client";

import type { Arch } from "@/lib/icon";
import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FriendsConfig, SiteConfig } from "@/config";
import { getArchIcon } from "@/lib/icon";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FriendsProps {
	friends: Friend[];
}

export const FriendsLayout: React.FC<FriendsProps> = ({ friends }) => {
	const t = useTranslations();
	const [shuffledFriends, setShuffledFriends] = useState<Friend[]>([]);

	useEffect(() => {
		const shuffleArray = (array: Friend[]) => {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]];
			}
		};

		const newShuffledFriends = [...friends];
		shuffleArray(newShuffledFriends);
		setShuffledFriends(newShuffledFriends);

		// Add touch device support for hover effect
		const cards = document.querySelectorAll("#friend-card > *");
		cards.forEach((card) => {
			card.addEventListener("touchstart", () => {
				card.classList.add("group-hover");
			});
			card.addEventListener("touchend", () => {
				card.classList.remove("group-hover");
			});
		});

		return () => {
			cards.forEach((card) => {
				card.removeEventListener("touchstart", () => {});
				card.removeEventListener("touchend", () => {});
			});
		};
	}, [friends]);

	return (
		<div className="mt-5 flex flex-col items-start mb-6 px-4 sm:px-6 lg:px-8">
			<motion.h1
				className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-10"
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<mark className="line">{t(FriendsConfig.title)}</mark>
				<p className="mt-6 text-sm text-muted-foreground max-w-2xl leading-relaxed">
					{t(FriendsConfig.description.text)}
					{" "}
					<mark>
						<Link
							href={FriendsConfig.description.link.url}
							target="_blank"
							className="text-[#3388BB] transition-all duration-300 ease-in-out hover:text-[#FF5522] hover:scale-110"
						>
							{t(FriendsConfig.description.link.text)}
						</Link>
					</mark>
					{" "}
					{t(FriendsConfig.description.suffix)}
					<br />
					{t("friends.opml.text")}
					{" "}
					<mark>
						<Link
							href={SiteConfig.opmlURL}
							target="_blank"
							className="text-[#3388BB] transition-all duration-300 ease-in-out hover:text-[#FF5522] hover:scale-110"
						>
							{t("friends.opml.link.text")}
						</Link>
					</mark>
					{" "}
					{t("friends.opml.suffix")}
					{" "}
					<mark>
						<Link
							href={SiteConfig.followListURL}
							target="_blank"
							className="text-[#3388BB] transition-all duration-300 ease-in-out hover:text-[#FF5522] hover:scale-110"
						>
							{t("friends.opml.followList")}
						</Link>
					</mark>
				</p>
			</motion.h1>
			<div className="container mx-auto mt-2 px-4 py-12 flex flex-col items-center animate-in fade-in duration-500">
				<div id="friend-card" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{shuffledFriends.map(friend => (
						<Card
							key={`${friend.name}`}
							className="relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 group"
						>
							<CardContent className="p-4">
								<a href={friend.url} target="_blank" rel="noopener noreferrer" className="block">
									<div className="flex flex-col items-center">
										<Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-3 sm:mb-4 transition-all duration-300 group-hover:opacity-40 group-hover:blur-sm rounded-full">
											<AvatarImage src={friend.avatar} alt={friend.name} />
											<AvatarFallback>{friend.name[0]}</AvatarFallback>
										</Avatar>
										<h3 className="text-base sm:text-lg font-semibold text-center">{friend.name}</h3>
									</div>
									<div
										id="friend-card-hover"
										className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/60 backdrop-blur-md p-4"
									>
										<h3 className="text-base sm:text-lg font-semibold mb-2 text-shadow-sm">{friend.name}</h3>
										<p
											className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-4 overflow-hidden text-ellipsis text-shadow-sm"
											style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
										>
											{friend.description}
										</p>
										<p className="text-muted-foreground text-xs mb-2 sm:mb-4 truncate max-w-full text-shadow-sm">
											{friend.url}
										</p>
										<div className="flex flex-wrap justify-center gap-2 mt-2">
											{friend.techstack.map((tech, index) => (
												<TooltipProvider key={index} delayDuration={100}>
													<Tooltip>
														<TooltipTrigger>
															<Icon icon={getArchIcon(tech as Arch)} className="w-6 h-6 text-primary" />
														</TooltipTrigger>
														<TooltipContent>
															<p>{tech}</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											))}
										</div>
									</div>
								</a>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default FriendsLayout;
