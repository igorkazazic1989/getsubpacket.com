import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function uploadLink(inviteToken: string) {
  return `${site.url}/u/${inviteToken}`;
}

export function emailLayout(bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#F3F4F1;font-family:Arial,Helvetica,sans-serif;color:#1E2B33">
<div style="max-width:560px;margin:0 auto;padding:28px 20px">
<div style="font-weight:700;font-size:18px;margin-bottom:18px">${escapeHtml(site.name)}</div>
<div style="background:#fff;border:1px solid #D5D9D3;border-radius:8px;padding:22px;font-size:15px;line-height:1.55">${bodyHtml}</div>
<p style="font-size:12px;color:#5b6770;margin-top:16px">Sent by ${escapeHtml(site.name)} on behalf of a builder you work with.</p>
</div></body></html>`;
}

export function button(href: string, label: string) {
  return `<p style="margin:20px 0"><a href="${href}" style="background:#1E2B33;color:#fff;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:700;display:inline-block">${escapeHtml(label)}</a></p>`;
}

export async function sendEmail(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  if (!resend) {
    console.log("[email:dev] →", opts.to, "|", opts.subject);
    return { ok: true };
  }
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || `${site.name} <onboarding@resend.dev>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  });
  if (error) {
    console.error("[email] failed", error);
    return { ok: false };
  }
  return { ok: true };
}

export function inviteEmail(p: { subName: string; companyName: string; inviteToken: string }) {
  const link = uploadLink(p.inviteToken);
  return {
    subject: `${p.companyName} needs your insurance certificates and W-9`,
    html: emailLayout(`<p>Hi ${escapeHtml(p.subName)},</p>
<p>${escapeHtml(p.companyName)} keeps subcontractor paperwork in ${escapeHtml(site.name)}. Please upload these from your phone or computer:</p>
<ul style="padding-left:18px"><li>General liability certificate of insurance</li><li>Workers' comp certificate, or your exemption</li><li>Signed W-9</li><li>Contractor license, if your trade needs one</li><li>Signed subcontractor agreement</li></ul>
<p>No account or password. Photos of paper documents are fine.</p>
${button(link, "Upload my documents")}
<p style="font-size:13px;color:#5b6770">Or open this link: ${link}</p>`),
  };
}
