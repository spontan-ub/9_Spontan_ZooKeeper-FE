"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { goHome, goLogin } from "@/lib/actions";
import { register } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	EyeIcon,
	EyeOff,
	LockKeyholeOpenIcon,
	MailIcon,
	UserRound,
} from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function RegisterForm() {
	const RegisterSchema = z.object({
		nama: z.string(),
		email: z.string().email(),
		password: z.string().min(8, "Password must be at least 8 characters"),
		role: z.enum(["admin", "zookeeper"], {
			required_error: "You need to select a notification type.",
		}),
	});

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			nama: "",
			email: "",
			password: "",
			role: "admin",
		},
	});

	async function submit(data: z.infer<typeof RegisterSchema>) {
		const response = await register(
			data.nama,
			data.email,
			data.password,
			data.role,
		);

		if (response.error) {
			return form.setError("email", {
				type: "manual",
				message: "User sudah terdaftar",
			});
		}

		goLogin();
	}

	const [showPassword, setShowPassword] = React.useState(false);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(submit)}
				className="flex flex-col gap-4 w-full"
			>
				<FormField
					control={form.control}
					name="nama"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel className="text-stone-900 text-c1 font-medium">
									Nama
								</FormLabel>
								<FormControl>
									<Input
										className="font-regular text-stone-900 bg-accent border border-stone-900 w-80 h-10text-stone-900 text-c2 font-regular"
										placeholder="Masukkan nama anda"
										{...field}
										startIcon={UserRound}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel className="text-stone-900 text-c1 font-medium">
									Email
								</FormLabel>
								<FormControl>
									<Input
										className="font-regular text-stone-900 text-c2 bg-accent border border-stone-900 w-80 h-10"
										placeholder="Masukkan email"
										{...field}
										startIcon={MailIcon}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel className="text-stone-900 text-c1 font-medium">
									Password
								</FormLabel>
								<FormControl>
									<Input
										className="font-regular text-stone-900 text-c2 bg-accent border border-stone-900 w-80 h-10"
										placeholder="Masukkan password"
										type={showPassword ? "text" : "password"}
										{...field}
										startIcon={LockKeyholeOpenIcon}
										endIcon={[EyeIcon, EyeOff]}
										onEndIconClick={() => setShowPassword(!showPassword)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel className="text-c1 font-medium">Role</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className="flex flex-col space-y-1"
								>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="admin" />
										</FormControl>
										<FormLabel className="text-stone-900 text-c1 font-medium">
											Admin
										</FormLabel>
									</FormItem>
									<FormItem className="text-stone-900 text-c1 font-medium flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="zookeeper" />
										</FormControl>
										<FormLabel className="font-normal">Zookeeper</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="mt-8 mb-12 w-80 h-9 p-2 bg-lime-900 text-white text-center hover:bg-lime-700"
				>
					Daftar
				</Button>
			</form>
		</Form>
	);
}
