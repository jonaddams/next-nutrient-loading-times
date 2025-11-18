"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LoadingMethod, LoadingOption } from "@/types";

export default function Home() {
	const router = useRouter();
	const [selectedMethods, setSelectedMethods] = useState<LoadingMethod[]>([]);

	const loadingOptions: LoadingOption[] = [
		{
			id: "standard",
			name: "Web SDK Viewer",
			description:
				"Standard PDF loading via Web SDK. Loads the entire document before rendering.",
			enabled: true,
		},
		{
			id: "linearized",
			name: "Web SDK with Linearized Loading",
			description:
				"Progressive loading that displays the first page quickly while the rest loads in the background.",
			enabled: true,
		},
		{
			id: "document-engine",
			name: "Nutrient DWS Viewer",
			description:
				"Server-side processing that streams only necessary content to the viewer for optimal performance.",
			enabled: true,
		},
	];

	const toggleMethod = (method: LoadingMethod) => {
		setSelectedMethods((prev) =>
			prev.includes(method)
				? prev.filter((m) => m !== method)
				: prev.length < 3
					? [...prev, method]
					: prev,
		);
	};

	const handleStartComparison = () => {
		if (selectedMethods.length === 0) return;

		const params = new URLSearchParams();
		params.set("methods", selectedMethods.join(","));

		router.push(`/compare?${params.toString()}`);
	};

	const canAddMore = selectedMethods.length < 3;

	return (
		<div className="min-h-screen bg-white dark:bg-[#1a1414]">
			{/* Header */}
			<header className="border-b border-(-warm-gray-400) bg-white dark:bg-[#1a1414]">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between gap-4 flex-wrap">
						<div>
							<h1 className="!mb-2">Nutrient Document Loading Comparison</h1>
							<p className="text-sm opacity-60">
								Compare loading performance across different methods
							</p>
						</div>
						<span className="nutrient-badge nutrient-badge-neutral">
							Web SDK v{process.env.NEXT_PUBLIC_WEB_SDK_VERSION}
						</span>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 py-12">
				<div className="max-w-4xl mx-auto">
					{/* Instructions */}
					<div className="mb-8">
						<h2 className="!mb-4">Select Loading Methods to Compare</h2>
						<p className="text-(-warm-gray-800) dark:text-(-warm-gray-400)">
							Choose up to 3 loading methods to compare side-by-side. Each
							viewer will display performance metrics including time to first
							render, fully loaded, and interactive states.
						</p>
					</div>

					{/* Loading Options */}
					<div className="space-y-4 mb-8">
						{loadingOptions.map((option) => {
							const isSelected = selectedMethods.includes(option.id);
							const isDisabled = !canAddMore && !isSelected;

							return (
								<button
									key={option.id}
									type="button"
									onClick={() => toggleMethod(option.id)}
									disabled={isDisabled}
									className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
										isSelected
											? "border-(-black) dark:border-(-white) bg-(-warm-gray-100) dark:bg-(-warm-gray-950)"
											: "border-(-warm-gray-400) hover:border-(-warm-gray-600)"
									} ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
								>
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<div
													className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
														isSelected
															? "bg-(-black) dark:bg-(-white) border-(-black) dark:border-(-white)"
															: "border-(-warm-gray-400)"
													}`}
												>
													{isSelected && (
														<svg
															className="w-3 h-3 text-(-white) dark:text-(-black)"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<title>Selected</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={3}
																d="M5 13l4 4L19 7"
															/>
														</svg>
													)}
												</div>
												<h3 className="!mb-0">{option.name}</h3>
											</div>
											<p className="text-sm text-(-warm-gray-600) dark:text-(-warm-gray-600) ml-8">
												{option.description}
											</p>
										</div>
									</div>
								</button>
							);
						})}
					</div>

					{/* Selection Summary */}
					{selectedMethods.length > 0 && (
						<div className="nutrient-alert nutrient-alert-neutral mb-8">
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
									Selected {selectedMethods.length} method
									{selectedMethods.length > 1 ? "s" : ""} for comparison
									{selectedMethods.length === 3 && " (maximum reached)"}
								</p>
							</div>
						</div>
					)}

					{/* Start Button */}
					<button
						type="button"
						onClick={handleStartComparison}
						disabled={selectedMethods.length === 0}
						className="btn btn-primary w-full py-6 text-base disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{selectedMethods.length === 0
							? "Select at least one method to continue"
							: `Start Comparison with ${selectedMethods.length} Method${selectedMethods.length > 1 ? "s" : ""}`}
					</button>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t border-(-warm-gray-400) mt-16">
				<div className="max-w-7xl mx-auto px-6 py-6">
					<p className="text-sm text-center text-(-warm-gray-600)">
						Powered by Nutrient Web SDK • Built with Next.js
					</p>
				</div>
			</footer>
		</div>
	);
}
