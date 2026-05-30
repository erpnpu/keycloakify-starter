import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { ClassKey } from "keycloakify/login";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import npuLogoUrl from "../assets/NPU_logo-DzsWpayW.png";
import erpLogoUrl from "../assets/ERPLOGO-ChsBTKyw.svg";
import "./login.css";

const templateClasses = {
    kcHtmlClass: "npu-login-html",
    kcBodyClass: "npu-login-body",
    kcLoginClass: "npu-login-shell",
    kcHeaderClass: "npu-template-header",
    kcHeaderWrapperClass: "npu-template-header-wrapper",
    kcFormCardClass: "npu-login-card",
    kcFormHeaderClass: "npu-form-header",
    kcLocaleMainClass: "npu-locale",
    kcLocaleWrapperClass: "npu-locale-wrapper",
    kcLocaleDropDownClass: "npu-locale-dropdown",
    kcLocaleListClass: "npu-locale-list",
    kcLocaleListItemClass: "npu-locale-item",
    kcLocaleItemClass: "npu-locale-link",
    kcFormGroupClass: "npu-template-form-group",
    kcContentWrapperClass: "npu-template-content-wrapper",
    kcAlertClass: "npu-alert",
    kcAlertTitleClass: "npu-alert-title",
    kcSignUpClass: "npu-signup",
    kcInfoAreaWrapperClass: "npu-signup-wrapper"
} satisfies Partial<Record<ClassKey, string>>;

function translateMessageSummary(summary: string): string {
    switch (summary.trim()) {
        case "Invalid username":
            return "ชื่อผู้ใช้ไม่ถูกต้อง";
        default:
            return summary;
    }
}

export default function LoginResetPassword(
    props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>
) {
    const { kcContext, i18n, Template, classes } = props;
    const { url, realm, auth, messagesPerField } = kcContext;

    const translatedKcContext =
        kcContext.message === undefined
            ? kcContext
            : {
                  ...kcContext,
                  message: {
                      ...kcContext.message,
                      summary: translateMessageSummary(kcContext.message.summary)
                  }
              };

    return (
        <Template
            kcContext={translatedKcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            classes={{
                ...(classes ?? {}),
                ...templateClasses
            }}
            headerNode={null}
            bodyClassName="npu-login-body"
            displayMessage={!messagesPerField.existsError("username")}
            displayInfo={false}
        >
            <div className="npu-login-layout">
                <section className="npu-brand-panel" aria-label="ERP NPU branding">
                    <img className="npu-brand-image" src={npuLogoUrl} alt="NPU logo" />
                </section>

                <section className="npu-form-panel">
                    <div className="npu-form-panel-inner">
                        <div className="npu-panel-header-copy">
                            <img className="npu-erp-logo" src={erpLogoUrl} alt="ERP NPU" />
                            <h3>
                                <span className="npu-lock-icon" aria-hidden>
                                    <svg viewBox="0 0 24 24" focusable="false">
                                        <path d="M17 8h-1V6a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-6 7.73V17a1 1 0 1 0 2 0v-1.27a2 2 0 1 0-2 0ZM10 8V6a2 2 0 1 1 4 0v2h-4Z" />
                                    </svg>
                                </span>
                                <span>ลืมรหัสผ่าน</span>
                            </h3>
                            <p className="npu-form-subtitle">
                                {realm.duplicateEmailsAllowed
                                    ? "กรอกชื่อผู้ใช้หรืออีเมลเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่"
                                    : "กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่"}
                            </p>
                        </div>

                        <form className="npu-login-form" id="kc-reset-password-form" action={url.loginAction} method="post">
                            <div className="npu-form-field">
                                <label htmlFor="username">
                                    {!realm.loginWithEmailAllowed
                                                                                ? "ชื่อผู้ใช้"
                                        : !realm.registrationEmailAsUsername
                                                                                    ? "ชื่อผู้ใช้หรืออีเมล"
                                                                                    : "อีเมล"}
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    autoFocus
                                    defaultValue={auth.attemptedUsername ?? ""}
                                    aria-invalid={messagesPerField.existsError("username")}
                                />
                                {messagesPerField.existsError("username") && (
                                    <span
                                        className="npu-field-error"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(translateMessageSummary(messagesPerField.get("username")))
                                        }}
                                    />
                                )}
                            </div>

                            <div className="npu-reset-actions">
                                <a className="npu-text-link" href={url.loginUrl}>
                                    กลับไปหน้าเข้าสู่ระบบ
                                </a>
                                <button className="npu-submit-button" type="submit">
                                    ส่งคำขอตั้งรหัสผ่านใหม่
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </Template>
    );
}
