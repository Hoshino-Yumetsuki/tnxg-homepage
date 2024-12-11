import type { RecentlyModel } from "@mx-space/api-client";
import RecentlyLayout from "@/components/layouts/recently";
import { MarkdownRender } from "@/components/render/markdown";
import { cache } from "react";

export const revalidate = 60 * 60 * 24 * 2;

export const metadata = {
	title: "动态",
};

const getRecentlies = async (): Promise<RecentlyModel[]> => {
	const response = cache(async () => {
		const res = await fetch("https://mx.tnxg.top/api/v2/recently/all");
		const data: RecentlyModel[] = (await res.json()).data;
		return data;
	});

	const RecentliesData: RecentlyModel[] = await Promise.all(
		(await response()).map(async (recently) => {
			const renderedContent = await MarkdownRender(recently.content);
			return {
				...recently,
				content: renderedContent,
			};
		}),
	);

	return RecentliesData;
};

// 异步获取并渲染好友列表
export async function Recently() {
	const Recentlies = await getRecentlies();
	return <RecentlyLayout Recentlies={Recentlies} />;
}

export default Recently;