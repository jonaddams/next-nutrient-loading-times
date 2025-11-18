"use client";

import type { Instance } from "@nutrient-sdk/viewer";
import { useEffect, useRef, useState } from "react";

interface ViewerProps {
	document: string | ArrayBuffer;
}

export default function Viewer({ document }: ViewerProps) {
	const containerRef = useRef(null);
	const [instantJSON, setInstantJSON] = useState(null);
	// const [xfdfString, setXfdfString] = useState<string | null>(null);

	useEffect(() => {
		// Fetch instantJSON when component mounts
		fetch("/instantjson-intivahealth.json")
			.then((res) => res.json())
			.then((data) => setInstantJSON(data))
			.catch((err) => console.error("Failed to load instantJSON:", err));

		// fetch("/xfdf.xml")
		// 	.then((res) => res.text())
		// 	.then((data) => setXfdfString(data))
		// 	.catch((err) => console.error("Failed to load XFDF:", err));
	}, []);

	useEffect(() => {
		const container = containerRef.current;

		const { NutrientViewer } = window;
		if (container && NutrientViewer && instantJSON) {
			NutrientViewer.load({
				container,
				document: document,
				allowLinearizedLoading: true,
				// instantJSON: instantJSON,
			}).then(async (instance: Instance) => {
				// Instance loaded successfully
				window.instance = instance;
				console.log("InstantJSON: ", instantJSON);

				// await instance.applyOperations([
				// 	{
				// 		type: "applyInstantJson",
				// 		instantJson: instantJSON,
				// 	},
				// ]);

				// if (xfdfString) {
				// 	await instance.applyOperations([
				// 		{
				// 			type: "applyXfdf",
				// 			xfdf: xfdfString,
				// 		},
				// 	]);
				// }
				// await instance.save();

				// const exportedXfdfString = await instance.exportXFDF();
				// console.log("Exported XFDF: ", exportedXfdfString);

				// const formFields = await instance?.getFormFields();
				// console.log("Form Fields: ", formFields.toArray().toString());

				// const annotations = await instance?.getAnnotations(0);
				// console.log("Annotations: ", annotations.toArray().toString());

				// const newJSON = await instance.exportInstantJSON();

				// instance.exportInstantJSON().then((instantJSON) => {
				// 	console.log("Exported InstantJSON: ", instantJSON);
				// });
				// console.log("Exported InstantJSON: ", newJSON);

				// const annotationIds = annotations?.map((a) => a.id).join(",");
				// console.log({ annotationIds });

				// formFields?.forEach((ff) => {
				// 	console.log(
				// 		`FormField | name="${ff.name}" | id=${
				// 			ff.id
				// 		} | associated annotations: [${ff.annotationIds.join(",")}]`,
				// 	);
				// });
			});
		}

		return () => {
			NutrientViewer?.unload(container);
		};
	}, [document, instantJSON]);

	// You must set the container height and width, and position it
	// Note: Nutrient Viewer will create its own internal portal container
	return (
		<div
			ref={containerRef}
			style={{ height: "100vh", width: "100%", position: "relative" }}
		/>
	);
}
