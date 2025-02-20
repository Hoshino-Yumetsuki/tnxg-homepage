import type { RecentlyModel } from "@mx-space/api-client";
import type { Metadata } from "next";
import RecentlyLayout from "@/components/layouts/recently";
import { MarkdownRender } from "@/components/render/markdown";
import { APIConfig } from "@/config";
import { getLocale, getTranslations } from "next-intl/server";
import { cache } from "react";
import "server-only";

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	return {
		title: t("sidebar.sections.recently"),
	};
}

// 使用 cache 包装整个数据获取函数
const getRecentlies = cache(async (): Promise<RecentlyModel[]> => {
	try {
		const res = await fetch(APIConfig.endpoints.recently, {
			next: { revalidate: 60 }, // 添加缓存控制
		});

		if (!res.ok) {
			throw new Error(`Failed to fetch recently data: ${res.status}`);
		}

		const data: RecentlyModel[] = (await res.json()).data;

		// 处理 markdown 内容
		const RecentliesData = await Promise.all(
			data.map(async recently => ({
				...recently,
				content: await MarkdownRender(recently.content),
			})),
		);

		return RecentliesData;
	}
	catch (error) {
		console.error("Error fetching recently data:", error);
		return [];
	}
});

// 重命名为 Page 组件（Next.js 13+ 约定）
export default async function Page() {
	const recentlies = await getRecentlies();

	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="w-full max-w-4xl">
				<RecentlyLayout Recentlies={recentlies} />
			</div>
		</div>
	);
}
