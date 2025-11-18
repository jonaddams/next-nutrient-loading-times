"use client";

import { useState } from "react";
import Viewer from "@/components/Viewer";

export default function Home() {
	const [isViewerOpen, setIsViewerOpen] = useState(false);
	const webSDKVersion = process.env.NEXT_PUBLIC_WEB_SDK_VERSION;
	console.log("Web SDK Version:", webSDKVersion);

	const openViewer = () => {
		setIsViewerOpen(true);
	};

	const closeViewer = () => {
		setIsViewerOpen(false);
	};

	if (isViewerOpen) {
		return (
			<div className="min-h-screen bg-white">
				{/* Header */}
				<div className=" shadow-sm border-b">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center space-x-4">
								<h1 className="text-xl font-semibold text-gray-900">
									Document Viewer
								</h1>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									Web SDK v{webSDKVersion}
								</span>
							</div>
							<button
								type="button"
								onClick={closeViewer}
								className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
							>
								Close Viewer
							</button>
						</div>
					</div>
				</div>

				{/* Viewer Container */}
				<div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
					<Viewer document="/documents/Sumitomo_Mitsui_Banking_Corporation_-_Custom_Nutrient_Low-Code_MSA_v1.2c_(Nutrient_edits_10-23-25) (1).docx" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
			{/* Header */}
			<header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Document Icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<h1 className="text-xl font-semibold text-gray-900">
								Nutrient Web SDK
							</h1>
						</div>
						<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
							v{webSDKVersion}
						</span>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center">
					{/* Hero Section */}
					<div className="max-w-3xl mx-auto">
						<h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
							Modern Document Viewer
						</h2>
						<p className="text-xl text-gray-600 mb-8">
							Experience powerful PDF viewing capabilities with the Nutrient Web
							SDK. Fast, secure, and feature-rich document handling in your
							browser.
						</p>
					</div>

					{/* Features Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
						<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Lightning Fast</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Lightning Fast
							</h3>
							<p className="text-gray-600">
								Optimized rendering engine for smooth document viewing
								experience.
							</p>
						</div>

						<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Secure</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Secure
							</h3>
							<p className="text-gray-600">
								Enterprise-grade security with document protection and access
								controls.
							</p>
						</div>

						<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
							<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Feature Rich</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m-4-8l4-4m0 0l4-4m-4 4l4 4m-4-4v8"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Feature Rich
							</h3>
							<p className="text-gray-600">
								Annotations, forms, signatures, and advanced document
								manipulation tools.
							</p>
						</div>
					</div>

					{/* Document Preview Card */}
					<div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
						<div className="flex items-center justify-center mb-6">
							<div className="w-16 h-20 bg-red-500 rounded-lg shadow-md flex items-center justify-center mr-4">
								<svg
									className="w-8 h-8 text-white"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<title>PDF Document</title>
									<path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z" />
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM14 9h-1V4l5 5h-4z" />
								</svg>
							</div>
							<div className="text-left">
								<h3 className="text-lg font-semibold text-gray-900">
									Sample Document
								</h3>
								<p className="text-gray-600">
									SampleSignedDocumentGlobalTrust.pdf
								</p>
								<p className="text-sm text-gray-500">
									Ready to view with advanced features
								</p>
							</div>
						</div>

						<button
							type="button"
							onClick={openViewer}
							className="inline-flex items-center px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200"
						>
							<svg
								className="w-5 h-5 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>View Document</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
							Open Document Viewer
						</button>
					</div>

					{/* Footer */}
					<div className="text-center text-gray-500 text-sm">
						<p>
							Powered by Nutrient Web SDK • Built with Next.js and Tailwind CSS
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
