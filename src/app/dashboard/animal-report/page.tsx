"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import CustomCard from "@/components/ui/customCard";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { goDashboard, goHome } from "@/lib/actions";
import { listHewan } from "@/lib/data";
import type { Report } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createReport } from "@/services/report";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
	CalendarDays,
	CalendarFold,
	Check,
	CheckCircleIcon,
	ChevronRightIcon,
	CornerUpLeft,
	CornerUpRight,
} from "lucide-react";
import { Content } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

type StepProp = {
	index: number;
	title: string;
	description: string;
};

const steps: StepProp[] = [
	{
		index: 1,
		title: "Pilih Hewan yang Diperiksa",
		description:
			"Pilih hewan yang ingin Anda periksa dan temukan informasi penting mengenai mereka. Ayo mulai!",
	},
	{
		index: 2,
		title: "JENIS HEWAN",
		description:
			"Pilih JENIS HEWAN yang ingin Anda periksa dan temukan informasi penting mengenai mereka. Ayo mulai!",
	},
	{
		index: 3,
		title: "Riwayat Kesehatan Hewan",
		description:
			"Riwayat kesehatan dapat membantu dokter hewan dalam memberikan perawatan yang terbaik.",
	},
	{
		index: 4,
		title: "Status Kesehatan",
		description:
			"Anda diminta untuk memperkirakan status kesehatan hewan tersebut",
	},
];

const ReportSchema = z.object({
	spesies: z.string().min(1, "Spesies tidak boleh kosong"),
	animal_id: z.string().min(1, "Hewan tidak boleh kosong"),
	deskripsi: z.string().max(65535).min(1, "Deskripsi tidak boleh kosong"),
	kondisi_saat_ini: z.enum(["sehat", "sakit", "pemulihan", "kronis"]),
	foto: z.string().url("Foto harus berupa URL"),
});

export default function AnimalReport() {
	const [index, setIndex] = useState(1);

	const form = useForm<z.infer<typeof ReportSchema>>({
		resolver: zodResolver(ReportSchema),
		defaultValues: {
			spesies: "",
			animal_id: "",
			deskripsi: "",
			kondisi_saat_ini: "sehat",
			foto: "",
		},
	});

	const submit = async (data: z.infer<typeof ReportSchema>) => {
		const report: Report = {
			animal_id: data.animal_id,
			description: data.deskripsi,
			is_request_doctor: true,
			photo_url: data.foto,
		};

		const response = await createReport(report);

		if (response.error) {
			return form.setError("animal_id", {
				type: "manual",
				message: "Gagal mengirimkan laporan",
			});
		}

		goDashboard();
	};

	return (
		<div className="bg-neutral-200 w-full flex flex-col">
			{index === 1 && (
				<Page
					step={steps[0]}
					index={index}
					setIndex={setIndex}
					form={form}
					submit={submit}
				/>
			)}
			{index === 2 && (
				<Page
					step={steps[1]}
					index={index}
					setIndex={setIndex}
					form={form}
					submit={submit}
				/>
			)}
			{index === 3 && (
				<Page
					step={steps[2]}
					index={index}
					setIndex={setIndex}
					form={form}
					submit={submit}
				/>
			)}
			{index === 4 && (
				<Page
					step={steps[3]}
					index={index}
					setIndex={setIndex}
					form={form}
					submit={submit}
				/>
			)}
		</div>
	);
}

function Page({
	step,
	index,
	setIndex,
	form,
	submit,
}: {
	step: StepProp;
	index: number;
	setIndex: Dispatch<SetStateAction<number>>;
	form: UseFormReturn<z.infer<typeof ReportSchema>>;
	submit: (data: z.infer<typeof ReportSchema>) => void;
}) {
	function incrementIndex() {
		if (index < 5) setIndex(index + 1);
	}

	function decrementIndex() {
		if (index > 1) setIndex(index - 1);
		else if (index === 1) goDashboard();
	}

	return (
		<>
			<div>
				<div className="px-9 pt-14 pb-5">
					<div className="flex flex-row items-center mb-5 justify-center">
						<Button
							size="icon"
							className="w-8 bg-transparent hover:bg-transparent justify-center items-center p-0 m-0"
							onClick={decrementIndex}
						>
							<CornerUpLeft className="w-full h-full" />
						</Button>
						<Image
							src="/LogoZooPort1.svg"
							alt="logo"
							width={100}
							height={50}
							className="justify-center m-auto"
						/>
					</div>
					<div className="flex flex-col">
						{index !== 2 && (
							<>
								<p className="text-h7 font-semibold">{step.title}</p>
								<p className="text-p3 font-regular">{step.description}</p>
							</>
						)}
						{index === 2 && (
							<>
								<p className="text-h7 font-semibold">
									{form.getValues("spesies")}
								</p>
								<p className="text-p3 font-regular">{`Pilih ${form.getValues(
									"spesies",
								)} yang ingin Anda periksa dan temukan informasi penting mengenai mereka. Ayo mulai!`}</p>
							</>
						)}
					</div>
				</div>
				<div className="bg-primary w-full rounded-t-[60px]">
					<div className="px-9 py-8 ">
						<div className="flex flex-row items-center justify-between w-full">
							{Array.from({ length: 3 }).map((_, i) => (
								// biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
								<>
									<div
										className={`h-7 w-7 rounded-full flex justify-center items-center ${
											i + 1 <= index
												? "bg-accent text-primary"
												: "bg-transparent border-2 border-accent text-accent"
										}`}
									>
										{i + 1 < index ? (
											<Check className="h-5 w-7" color="#4F6041" />
										) : (
											<p className="font-c1 text-medium">{i + 1}</p>
										)}
									</div>
									<ChevronRightIcon strokeWidth={0.5} color="#D0E6B2" />
								</>
							))}
							<div
								className={`h-7 w-7 rounded-full flex justify-center items-center ${
									5 <= index
										? "bg-accent text-primary"
										: "bg-transparent border-2 border-accent text-accent"
								}`}
							>
								{4 < index ? (
									<Check className="h-5 w-7" color="#4F6041" />
								) : (
									<p className="font-c1 text-medium">4</p>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-4 pt-5">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(submit)}>
									{index === 1 && (
										<FormField
											control={form.control}
											name="spesies"
											render={({ field }) => {
												return (
													<FormItem>
														<FormControl>
															<div className="flex flex-row flex-wrap w-full justify-between gap-y-7">
																{listHewan.map((s): React.ReactNode => {
																	return (
																		<CustomCard
																			onClick={() => {
																				setIndex(index + 1);
																				form.setValue("spesies", s.name);
																			}}
																			key={s.id}
																			title={s.name}
																			image={s.photo}
																		/>
																	);
																})}
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												);
											}}
										/>
									)}
									{index === 2 && (
										<FormField
											control={form.control}
											name="animal_id"
											render={({ field }) => {
												return (
													<FormItem>
														<FormControl>
															<div className="flex flex-row flex-wrap w-full justify-between gap-y-7">
																{listHewan.map((s): React.ReactNode => {
																	return (
																		<CustomCard
																			onClick={() => {
																				setIndex(index + 1);
																				form.setValue("animal_id", s.id);
																			}}
																			key={s.id}
																			title={s.name}
																			image={s.photo}
																		/>
																	);
																})}
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												);
											}}
										/>
									)}
									{index === 3 && (
										<>
											<FormField
												control={form.control}
												name="deskripsi"
												render={({ field }) => {
													return (
														<FormItem>
															<FormLabel className="text-p3 font-medium text-accent">
																Deskripsikan masalah kesehatan yang dialami oleh
																hewan tersebut!
															</FormLabel>
															<FormControl>
																<Textarea
																	className="text-c2 font-regular w-full h-60"
																	placeholder="Deskripsi..."
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													);
												}}
											/>
										</>
									)}
									{index === 4 && (
										<>
											<FormField
												control={form.control}
												name="kondisi_saat_ini"
												render={({ field }) => {
													return (
														<FormItem>
															<FormLabel className="text-p3 font-medium text-accent">
																Berdasarkan hasil perkiraan Anda, kondisi apa
																yang dialami oleh hewan pada saat ini?
															</FormLabel>
															<FormControl className="text-accent">
																<RadioGroup
																	onValueChange={field.onChange}
																	defaultValue={field.value}
																	className="flex flex-col space-y-1"
																>
																	<FormItem className="flex items-center space-x-3 space-y-0">
																		<FormControl>
																			<RadioGroupItem value="sehat" />
																		</FormControl>
																		<FormLabel className="text-p3 font-medium">
																			Sehat
																		</FormLabel>
																	</FormItem>
																	<FormItem className="flex items-center space-x-3 space-y-0">
																		<FormControl>
																			<RadioGroupItem value="sakit" />
																		</FormControl>
																		<FormLabel className="text-p3 font-medium">
																			Sedang Sakit
																		</FormLabel>
																	</FormItem>
																	<FormItem className="flex items-center space-x-3 space-y-0">
																		<FormControl>
																			<RadioGroupItem value="pemulihan" />
																		</FormControl>
																		<FormLabel className="text-p3 font-medium">
																			Pemulihan
																		</FormLabel>
																	</FormItem>
																	<FormItem className="flex items-center space-x-3 space-y-0">
																		<FormControl>
																			<RadioGroupItem value="kronis" />
																		</FormControl>
																		<FormLabel className="text-p3 font-medium">
																			Kondisi Kronis
																		</FormLabel>
																	</FormItem>
																</RadioGroup>
															</FormControl>
															<FormMessage />
														</FormItem>
													);
												}}
											/>
											<FormField
												control={form.control}
												name="foto"
												render={({ field }) => {
													return (
														<FormItem>
															<FormLabel className="text-p3 font-medium text-accent">
																Masukkan bukti foto untuk memperkirakan status
																kesehatan hewan tersebut
															</FormLabel>
															<FormControl>
																<Input
																	className="text-c2 font-regular w-full"
																	placeholder="Masukkan link foto"
																	type="file"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													);
												}}
											/>
										</>
									)}
									{index === 3 && (
										<Button
											variant="outline"
											className="w-full mt-10 mb-12 bg-accent"
											onClick={incrementIndex}
										>
											<p className="text-c1 font-medium">Lanjut</p>
										</Button>
									)}
									{index === 4 && (
										<Dialog>
											<DialogTrigger className="w-full">
												<Button
													variant="outline"
													className="w-full mt-10 mb-12 bg-accent"
													type="submit"
												>
													<p className="text-c1 font-medium">Kirim</p>
												</Button>
											</DialogTrigger>
											<DialogContent>
												<div className="flex flex-col gap-5 p-4 justify-center items-center">
													<CheckCircleIcon className="h-20 w-20" />
													<p className="text-h7 font-medium text-center">
														Terima kasih! Data telah dikirimkan!
													</p>
												</div>
												<Button
													variant="outline"
													className="w-full mt-10 bg-accent"
												>
													<Link href="/dashboard">
														<p className="text-c1 font-medium">Dashboard</p>
													</Link>
												</Button>
											</DialogContent>
										</Dialog>
									)}
								</form>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
