"use server";

import { redirect } from "next/navigation";
import { authorizedFetch } from "../auth/api-session";

async function send(path: string, method: string, body?: unknown) {
  await authorizedFetch(
    path,
    { method, body: body ? JSON.stringify(body) : undefined },
    { rotate: true },
  );
  redirect("/admin");
}

export async function setUserPlanAction(formData: FormData) {
  await send(`/api/v1/admin/users/${formData.get("userId")}/plan`, "PATCH", {
    plan: String(formData.get("plan")),
  });
}

export async function refreshLandingAction() {
  await send("/api/v1/admin/landing/refresh", "POST");
}

export async function addKeywordAction(formData: FormData) {
  await send("/api/v1/admin/keywords", "POST", { word: String(formData.get("word") ?? "") });
}

export async function rejectReportAction(formData: FormData) {
  await send(`/api/v1/admin/reports/${formData.get("id")}/reject`, "POST", {
    note: String(formData.get("note") ?? ""),
  });
}

export async function approveReportAction(formData: FormData) {
  await send(`/api/v1/admin/reports/${formData.get("id")}/approve`, "POST", {
    note: String(formData.get("note") ?? ""),
  });
}

export async function enquiryStatusAction(formData: FormData) {
  await send(`/api/v1/admin/enquiries/${formData.get("id")}`, "PATCH", {
    status: String(formData.get("status")),
  });
}

export async function commentsSwitchAction(formData: FormData) {
  await send("/api/v1/admin/config", "PATCH", {
    commentsGloballyEnabled: formData.get("commentsGloballyEnabled") === "on",
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
  });
}
