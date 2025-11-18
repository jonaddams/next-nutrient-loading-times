"use client";

import type { Configuration, Instance } from "@nutrient-sdk/viewer";
import { useEffect, useRef, useState } from "react";
import type { LoadingMethod, PerformanceMetrics, ViewerState } from "@/types";

interface ComparisonViewerProps {
	method: LoadingMethod;
	methodName: string;
	isStarted: boolean;
	state?: ViewerState;
	onUpdateState: (updates: Partial<ViewerState>) => void;
}

export default function ComparisonViewer({
	method,
	methodName,
	isStarted,
	state,
	onUpdateState,
}: ComparisonViewerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [metrics, setMetrics] = useState<PerformanceMetrics>({});
	const instanceRef = useRef<Instance | null>(null);
	const startTimeRef = useRef<number>(0);
	const isLoadingRef = useRef<boolean>(false);

	// Reset metrics when not started
	useEffect(() => {
		if (!isStarted) {
			setMetrics({});
		}
	}, [isStarted]);

	useEffect(() => {
		if (!isStarted || !containerRef.current || isLoadingRef.current) return;

		const container = containerRef.current;
		const { NutrientViewer } = window;

		if (!NutrientViewer) {
			onUpdateState({
				error: "Nutrient Viewer not loaded",
				isLoading: false,
			});
			return;
		}

		let mounted = true;
		isLoadingRef.current = true;
		startTimeRef.current = performance.now();

		onUpdateState({ isLoading: true, error: undefined });

		const loadViewer = async () => {
			// Ensure container is clean before loading
			try {
				if (instanceRef.current) {
					await NutrientViewer.unload(container);
					instanceRef.current = null;
				}
			} catch (err) {
				console.warn("Error unloading previous instance:", err);
			}

			if (!mounted) {
				isLoadingRef.current = false;
				return;
			}
			try {
				// Use different S3 files for each method to differentiate in Network tab
				let documentToLoad: string;

				if (method === "linearized") {
					// Use the properly linearized PDF from S3
					documentToLoad =
						"https://public-solutions-engineering-bucket.s3.eu-central-1.amazonaws.com/docs/cartographic-perspectives-linearized.pdf";
				} else {
					// Use the non-linearized PDF (for standard and document-engine)
					documentToLoad =
						"https://public-solutions-engineering-bucket.s3.eu-central-1.amazonaws.com/docs/cartographic-perpectives.pdf";
				}

				const licenseKey = process.env.NEXT_PUBLIC_WEB_SDK_LICENSE_KEY;

				let config: Configuration = {
					container,
					document: documentToLoad,
					licenseKey,
				};

				console.log(
					`[${method}] Starting load at ${performance.now() - startTimeRef.current}ms`,
				);
				console.log(`[${method}] Loading document: ${documentToLoad}`);

				// Configure based on loading method
				switch (method) {
					case "standard":
						// Standard loading - no special config
						config.allowLinearizedLoading = false;
						console.log(`[${method}] Config: allowLinearizedLoading = false`);
						break;

					case "linearized":
						// Enable linearized loading
						config.allowLinearizedLoading = true;
						console.log(`[${method}] Config: allowLinearizedLoading = true`);
						break;

					case "document-engine": {
						// Use Nutrient DWS with pre-configured token
						const serverUrl =
							process.env.NEXT_PUBLIC_DOCUMENT_ENGINE_SERVER_URL;
						const documentId =
							process.env.NEXT_PUBLIC_DOCUMENT_ENGINE_DOCUMENT_ID;
						const jwt = process.env.NEXT_PUBLIC_DOCUMENT_ENGINE_JWT;

						if (!serverUrl || !documentId || !jwt) {
							throw new Error("Nutrient DWS credentials not configured");
						}

						console.log(
							`[${method}] Using Nutrient DWS serverUrl: ${serverUrl}`,
						);
						console.log(`[${method}] Document ID: ${documentId}`);

						config = {
							container,
							serverUrl,
							authPayload: { jwt },
							documentId,
							instant: false,
						};
						break;
					}
				}

				// Load the viewer - this returns when first page is ready
				console.log(`[${method}] Calling NutrientViewer.load()...`);
				console.log(`[${method}] Full config:`, config);
				const loadStartTime = performance.now();
				const instance = await NutrientViewer.load(config);
				const loadEndTime = performance.now();
				const loadDuration = loadEndTime - loadStartTime;

				console.log(
					`[${method}] NutrientViewer.load() resolved after ${(loadDuration / 1000).toFixed(2)}s`,
				);

				// Check if document was linearized
				const docInfo = await instance.exportPDF();
				console.log(`[${method}] Document info:`, {
					pageCount: await instance.totalPageCount,
					blobSize: docInfo?.byteLength || "unknown",
				});

				if (!mounted) {
					await NutrientViewer.unload(container);
					return;
				}

				instanceRef.current = instance;

				// Time to first render - captured when load() resolves (first page visible)
				const firstRenderTime = performance.now();
				const timeToFirstRender = firstRenderTime - startTimeRef.current;

				console.log(
					`[${method}] First render: ${(timeToFirstRender / 1000).toFixed(2)}s (total time from start)`,
				);

				setMetrics((prev) => ({
					...prev,
					timeToFirstRender,
					startTime: startTimeRef.current,
				}));

				// For linearized: first render happens quickly, but document continues loading
				// For standard: load() waits for full document before resolving

				// Track when user can interact (usually same as first render for Web SDK)
				setMetrics((prev) => ({
					...prev,
					timeToInteractive: timeToFirstRender,
				}));

				// Track when document is fully loaded
				// Use the document.change event which fires when document is fully loaded
				let fullyLoadedCaptured = false;

				const checkFullyLoaded = async () => {
					if (!fullyLoadedCaptured && mounted) {
						try {
							const pageCount = await instance.totalPageCount;
							const currentPage = await instance.currentPageIndex;

							// Document is fully loaded when we can query all pages
							if (pageCount > 0 && currentPage !== undefined) {
								fullyLoadedCaptured = true;
								const fullyLoadedTime = performance.now();
								const timeToFullyLoaded =
									fullyLoadedTime - startTimeRef.current;

								console.log(
									`[${method}] Fully loaded: ${(timeToFullyLoaded / 1000).toFixed(2)}s (${pageCount} pages)`,
								);

								setMetrics((prev) => ({
									...prev,
									timeToFullyLoaded,
								}));
							}
						} catch (_err) {
							// Silently continue - document may still be loading
						}
					}
				};

				// Start checking immediately
				await checkFullyLoaded();

				// If not captured yet, poll periodically
				if (!fullyLoadedCaptured) {
					const pollInterval = setInterval(checkFullyLoaded, 200);

					// Clean up polling after 30 seconds
					setTimeout(() => {
						clearInterval(pollInterval);
					}, 30000);
				}

				// Get file size and check server capabilities
				try {
					const response = await fetch(documentToLoad, { method: "HEAD" });
					const contentLength = response.headers.get("content-length");
					const acceptRanges = response.headers.get("accept-ranges");
					const contentType = response.headers.get("content-type");

					console.log(`[${method}] Server headers:`, {
						contentLength,
						acceptRanges,
						contentType,
						supportsRangeRequests: acceptRanges === "bytes",
					});

					if (contentLength) {
						setMetrics((prev) => ({
							...prev,
							fileSize: parseInt(contentLength, 10),
						}));
					}
				} catch (err) {
					console.warn("Could not fetch file size:", err);
				}

				// Capture network timing using Resource Timing API
				// Wait longer to ensure all requests are captured
				setTimeout(() => {
					try {
						const entries = performance.getEntriesByType(
							"resource",
						) as PerformanceResourceTiming[];
						const fileName = documentToLoad.split("/").pop() || "";
						const pdfEntries = entries.filter((entry) =>
							entry.name.includes(fileName),
						);

						if (pdfEntries.length > 0) {
							console.log(
								`[${method}] ===== RESOURCE TIMING ANALYSIS FOR ${fileName} =====`,
							);
							console.log(
								`[${method}] Found ${pdfEntries.length} network requests for this PDF`,
							);

							pdfEntries.forEach((entry, index) => {
								console.log(`[${method}] Request #${index + 1}:`, {
									url: entry.name,
									startTime: `${entry.startTime.toFixed(2)}ms`,
									duration: `${entry.duration.toFixed(2)}ms`,
									transferSize:
										entry.transferSize +
										" bytes (" +
										(entry.transferSize / 1024 / 1024).toFixed(2) +
										" MB)",
									encodedBodySize: `${entry.encodedBodySize} bytes`,
									decodedBodySize: `${entry.decodedBodySize} bytes`,
									timeToFirstByte:
										(entry.responseStart - entry.requestStart).toFixed(2) +
										"ms",
									downloadTime: `${(entry.responseEnd - entry.responseStart).toFixed(2)}ms`,
								});
							});

							// Calculate total bytes transferred (for range requests, sum of all chunks)
							const totalTransferred = pdfEntries.reduce(
								(sum, entry) => sum + entry.transferSize,
								0,
							);
							const totalEncoded = pdfEntries.reduce(
								(sum, entry) => sum + entry.encodedBodySize,
								0,
							);
							const firstRequestStart = Math.min(
								...pdfEntries.map((e) => e.startTime),
							);
							const lastRequestEnd = Math.max(
								...pdfEntries.map((e) => e.startTime + e.duration),
							);
							const totalTime = lastRequestEnd - firstRequestStart;

							console.log(`[${method}] ===== SUMMARY =====`);
							console.log(`[${method}] Total requests: ${pdfEntries.length}`);
							console.log(
								`[${method}] Total bytes transferred: ${totalTransferred} (${(totalTransferred / 1024 / 1024).toFixed(2)} MB)`,
							);
							console.log(
								`[${method}] Total encoded body size: ${totalEncoded} (${(totalEncoded / 1024 / 1024).toFixed(2)} MB)`,
							);
							console.log(
								`[${method}] Total network time: ${totalTime.toFixed(2)} ms (${(totalTime / 1000).toFixed(2)}s)`,
							);
							console.log(
								`[${method}] Average download speed: ${(totalTransferred / 1024 / 1024 / (totalTime / 1000)).toFixed(2)} MB/s`,
							);
							console.log(
								`[${method}] ==========================================`,
							);
						} else {
							console.warn(
								`[${method}] No Resource Timing entries found for ${fileName}`,
							);
						}
					} catch (err) {
						console.warn(`[${method}] Could not capture Resource Timing:`, err);
					}
				}, 3000); // Wait 3 seconds to capture all requests

				onUpdateState({ isLoading: false });
				isLoadingRef.current = false;
			} catch (error) {
				console.error(`Error loading ${method} viewer:`, error);
				if (mounted) {
					onUpdateState({
						error:
							error instanceof Error ? error.message : "Failed to load viewer",
						isLoading: false,
					});
				}
				isLoadingRef.current = false;
			}
		};

		loadViewer();

		return () => {
			mounted = false;
			isLoadingRef.current = false;
			const cleanup = async () => {
				if (instanceRef.current && container) {
					try {
						await NutrientViewer?.unload(container);
					} catch (err) {
						console.warn("Error during cleanup:", err);
					}
					instanceRef.current = null;
				}
			};
			cleanup();
		};
	}, [isStarted, method, onUpdateState]);

	const formatTime = (ms?: number) => {
		if (ms === undefined) return "—";
		return `${(ms / 1000).toFixed(2)}s`;
	};

	const formatSize = (bytes?: number) => {
		if (bytes === undefined) return "—";
		const mb = bytes / (1024 * 1024);
		return `${mb.toFixed(2)} MB`;
	};

	const getStatusColor = () => {
		if (state?.error) return "border-(--code-coral)";
		if (state?.isLoading) return "border-(--digital-pollen)";
		if (metrics.timeToFullyLoaded) return "border-(--data-green)";
		return "border-(--warm-gray-400)";
	};

	return (
		<div
			className={`border-2 rounded-lg overflow-hidden flex flex-col ${getStatusColor()}`}
		>
			{/* Viewer Header */}
			<div className="bg-(--warm-gray-100) dark:bg-(--warm-gray-950) p-4 border-b border-(--warm-gray-400)">
				<div className="flex items-center justify-between mb-3">
					<h3 className="mb-0! text-lg">{methodName}</h3>
					{state?.isLoading && (
						<span className="nutrient-badge nutrient-badge-accent">
							Loading...
						</span>
					)}
					{state?.error && (
						<span className="nutrient-badge nutrient-badge-coral">Error</span>
					)}
					{!state?.isLoading && !state?.error && metrics.timeToFullyLoaded && (
						<span className="nutrient-badge nutrient-badge-success">
							Loaded
						</span>
					)}
				</div>

				{/* Metrics Display */}
				<div className="grid grid-cols-2 gap-2 text-xs">
					<div>
						<span className="text-(--warm-gray-600) uppercase font-mono">
							First Render
						</span>
						<div className="font-mono font-semibold">
							{formatTime(metrics.timeToFirstRender)}
						</div>
					</div>
					<div>
						<span className="text-(--warm-gray-600) uppercase font-mono">
							Fully Loaded
						</span>
						<div className="font-mono font-semibold">
							{formatTime(metrics.timeToFullyLoaded)}
						</div>
					</div>
					<div>
						<span className="text-(--warm-gray-600) uppercase font-mono">
							Interactive
						</span>
						<div className="font-mono font-semibold">
							{formatTime(metrics.timeToInteractive)}
						</div>
					</div>
					<div>
						<span className="text-(--warm-gray-600) uppercase font-mono">
							File Size
						</span>
						<div className="font-mono font-semibold">
							{formatSize(metrics.fileSize)}
						</div>
					</div>
				</div>

				{state?.error && (
					<div className="mt-3 text-xs text-(--code-coral) font-mono">
						{state.error}
					</div>
				)}
			</div>

			{/* Viewer Container */}
			<div className="flex-1 bg-(--warm-gray-200) dark:bg-(--black) min-h-[815px] relative">
				{!isStarted && (
					<div className="absolute inset-0 flex items-center justify-center text-(--warm-gray-600)">
						<p className="text-center">
							Click "Start All Viewers" to begin loading
						</p>
					</div>
				)}
				<div
					ref={containerRef}
					style={{
						width: "100%",
						height: "100%",
						minHeight: "500px",
						position: "relative",
					}}
				/>
			</div>
		</div>
	);
}
