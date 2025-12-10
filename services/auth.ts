"use server";

import {ActionState} from "@/lib/types";
import env from "@/lib/env";

import {z} from 'zod';
import {cookies} from "next/headers";

const LoginSchema = z.object({
    email: z.email(),
    password: z.string(),
});
export type LoginActionState = ActionState<{ email: string, password: string }>;

export async function login(_prev: LoginActionState, formData: FormData)
    : Promise<LoginActionState> {
    const result = LoginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!result.success) {
        console.log(result);
        return {
            success: false,
            message: "Please provide a valid email address",
            data: {
                email: formData.get("email")! as string,
                password: formData.get("password")! as string,
            }
        };
    }

    const data = result.data;
    try {
        await fetch(
            `${env.url.server}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            }
        );

        return {
            success: true,
            message: "You are logged in! Redirecting...",
            data: {
                email: "",
                password: "",
            }
        };
    } catch (error: any) {
        return {
            success: false,
            message: "Authentication failed",
            data: data,
        };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    try {
        await fetch(
            `${env.url.server}/api/users/logout?allSessions=true`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieHeader,
                },
            },
        );
    } catch (error: any) {
        // todo
    }
}

const ForgotSchema = z.object({
    email: z.email(),
});
export type ForgotActionState = ActionState<{ email: string }>;

export async function forgotPassword(
    _prev: ForgotActionState, formData: FormData
): Promise<ForgotActionState> {
    const result = LoginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!result.success) {
        console.log(result);
        return {
            success: false,
            message: "Please provide a valid email address",
            data: {
                email: formData.get("email")! as string,
            }
        };
    }

    const data = result.data;
    try {
        await fetch(`${env.url.server}/api/users/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
            }),
        });

        return {
            success: true,
            message: "An instruction to reset password will be sent to your email",
            data: {
                email: data.email,
            }
        };
    } catch (error: any) {
        return {
            success: false,
            message: "Unknown error",
            data: data,
        };
    }
}

const ResetSchema = z.object({
    token: z.string(),
    newPassword: z.string(),
});
export type ResetActionState = ActionState<{ token: string, newPassword: string }>;

export async function resetPassword(_prev: ResetActionState, formData: FormData)
    : Promise<ResetActionState> {
    const result = ResetSchema.safeParse({
        token: formData.get("token"),
        newPassword: formData.get("newPassword"),
    });

    if (!result.success) {
        console.log(result);
        return {
            success: false,
            message: "Please provide a valid password",
            data: {
                token: formData.get("newPassword")! as string,
                newPassword: formData.get("newPassword")! as string,
            }
        };
    }

    const data = result.data;
    try {
        await fetch(`${env.url.server}/api/users/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: "", // todo
                password: data.newPassword,
            }),
        });

        return {
            success: true,
            message: "Your password has been reset! Redirecting...",
            data: {
                token: "",
                newPassword: data.newPassword,
            }
        };
    } catch (error: any) {
        return {
            success: false,
            message: "Unknown error",
            data: data,
        };
    }
}

export async function me() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    await fetch(`${env.url.server}/api/users/me`, {
        headers: {Cookie: cookieHeader},
    });
}

