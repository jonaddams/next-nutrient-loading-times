"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import ComparisonViewer from "@/components/ComparisonViewer";
import type { LoadingMethod, ViewerState } from "@/types";

function CompareContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isStarted, setIsStarted] = useState(false);
	const [viewerStates, setViewerStates] = useState<ViewerState[]>([]);

	const methodsParam = searchParams.get("methods");

	const selectedMethods: LoadingMethod[] = methodsParam
		? (methodsParam.split(",") as LoadingMethod[])
		: [];

	useEffect(() => {
		if (selectedMethods.length === 0) {
			router.push("/");
			return;
		}

		// Initialize viewer states
		const initialStates: ViewerState[] = selectedMethods.map((method) => ({
			method,
			metrics: {},
			isLoading: false,
		}));
		setViewerStates(initialStates);
	}, [selectedMethods, router]);

	const handleStart = () => {
		setIsStarted(true);
	};

	const handleReset = () => {
		setIsStarted(false);
		// Reset viewer states
		const resetStates: ViewerState[] = selectedMethods.map((method) => ({
			method,
			metrics: {},
			isLoading: false,
		}));
		setViewerStates(resetStates);
	};

	const updateViewerState = useCallback(
		(method: LoadingMethod, updates: Partial<ViewerState>) => {
			setViewerStates((prev) =>
				prev.map((state) =>
					state.method === method ? { ...state, ...updates } : state,
				),
			);
		},
		[],
	);

	const getMethodName = (method: LoadingMethod): string => {
		switch (method) {
			case "standard":
				return "Web SDK Viewer";
			case "linearized":
				return "Web SDK with Linearized Loading";
			case "document-engine":
				return "Nutrient DWS Viewer";
		}
	};

	if (selectedMethods.length === 0) {
		return null;
	}

	// Determine grid layout based on number of viewers
	const gridClass =
		selectedMethods.length === 1
			? "grid-cols-1"
			: selectedMethods.length === 2
				? "grid-cols-1 lg:grid-cols-2"
				: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3";

	return (
		<div className="min-h-screen bg-white dark:bg-[#1a1414] flex flex-col">
			{/* Header */}
			<header className="border-b border-(-warm-gray-400) bg-white dark:bg-[#1a1414] shrink-0">
				<div className="max-w-[1920px] mx-auto px-6 py-4">
					<div className="flex items-center justify-between gap-4 flex-wrap">
						<div className="flex items-center gap-4">
							<Link
								href="/"
								className="text-sm opacity-60 hover:opacity-100 no-underline"
							>
								← Back to Selection
							</Link>
							<h1 className="mb-0! text-xl">Loading Comparison</h1>
						</div>
						<div className="flex items-center gap-3">
							{isStarted ? (
								<button
									type="button"
									onClick={handleReset}
									className="btn btn-secondary btn-sm"
								>
									Reset Comparison
								</button>
							) : (
								<button
									type="button"
									onClick={handleStart}
									className="btn btn-success btn-sm"
								>
									Start All Viewers
								</button>
							)}
							<span className="nutrient-badge nutrient-badge-neutral">
								{selectedMethods.length} Method
								{selectedMethods.length > 1 ? "s" : ""}
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* Info Alert */}
			<div className="border-b border-(-warm-gray-400) bg-(-warm-gray-100) dark:bg-(-warm-gray-950) shrink-0">
				<div className="max-w-[1920px] mx-auto px-6 py-4">
					<div className="nutrient-alert nutrient-alert-neutral">
						<div className="nutrient-alert-icon">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Info</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div className="nutrient-alert-content">
							<p>
								{!isStarted
									? 'Click "Start All Viewers" to begin the loading comparison. All viewers will start simultaneously for fair comparison.'
									: "Comparing loading performance across selected methods. Check browser console for detailed timing information."}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Viewer Grid */}
			<main className="flex-1 overflow-auto">
				<div className="max-w-[1920px] mx-auto p-6">
					<div className={`grid ${gridClass} gap-6 h-full`}>
						{selectedMethods.map((method) => {
							const state = viewerStates.find((s) => s.method === method);
							return (
								<ComparisonViewer
									key={method}
									method={method}
									methodName={getMethodName(method)}
									isStarted={isStarted}
									state={state}
									onUpdateState={(updates) =>
										updateViewerState(method, updates)
									}
								/>
							);
						})}
					</div>
				</div>
			</main>
		</div>
	);
}

export default function ComparePage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CompareContent />
		</Suspense>
	);
}
