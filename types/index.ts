export type LoadingMethod = "standard" | "linearized" | "document-engine";

export interface LoadingOption {
	id: LoadingMethod;
	name: string;
	description: string;
	enabled: boolean;
}

export interface PerformanceMetrics {
	timeToFirstRender?: number;
	timeToFullyLoaded?: number;
	timeToInteractive?: number;
	fileSize?: number;
	startTime?: number;
	endTime?: number;
}

export interface ViewerState {
	method: LoadingMethod;
	metrics: PerformanceMetrics;
	isLoading: boolean;
	error?: string;
}
