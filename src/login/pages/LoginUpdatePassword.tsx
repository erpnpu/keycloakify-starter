import { useState } from "react";
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
        case "Passwords do not match.":
            return "รหัสผ่านทั้งสองช่องไม่ตรงกัน";
        case "Invalid password: minimum length 8.":
            return "รหัสผ่านไม่ถูกต้อง: ความยาวอย่างน้อย 8 ตัวอักษร";
        default:
            return summary;
    }
}

function translateHtmlMessage(summary: string): string {
    return kcSanitize(translateMessageSummary(summary));
}

export default function LoginUpdatePassword(
    props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>
) {
    const { kcContext, i18n, Template, classes } = props;
    const { url, messagesPerField, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);

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
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
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
                                <span>{msg("updatePasswordTitle")}</span>
                            </h3>
                            <p className="npu-form-subtitle">ตั้งรหัสผ่านใหม่เพื่อดำเนินการต่อ</p>
                        </div>

                        <form className="npu-login-form" id="kc-passwd-update-form" action={url.loginAction} method="post">
                            <div className="npu-form-field">
                                <label htmlFor="password-new">{msg("passwordNew")}</label>
                                <div className="npu-password-field">
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        id="password-new"
                                        name="password-new"
                                        autoFocus
                                        autoComplete="new-password"
                                        aria-invalid={messagesPerField.existsError("password", "password-confirm")}
                                    />
                                    <button
                                        className="npu-password-toggle"
                                        type="button"
                                        aria-label={isPasswordVisible ? msgStr("hidePassword") : msgStr("showPassword")}
                                        aria-controls="password-new"
                                        onClick={() => setIsPasswordVisible(value => !value)}
                                    >
                                        {isPasswordVisible ? "🙈" : "👁"}
                                    </button>
                                </div>
                                {messagesPerField.existsError("password") && (
                                    <span
                                        className="npu-field-error"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: translateHtmlMessage(messagesPerField.get("password"))
                                        }}
                                    />
                                )}
                            </div>

                            <div className="npu-form-field">
                                <label htmlFor="password-confirm">{msg("passwordConfirm")}</label>
                                <div className="npu-password-field">
                                    <input
                                        type={isPasswordConfirmVisible ? "text" : "password"}
                                        id="password-confirm"
                                        name="password-confirm"
                                        autoComplete="new-password"
                                        aria-invalid={messagesPerField.existsError("password", "password-confirm")}
                                    />
                                    <button
                                        className="npu-password-toggle"
                                        type="button"
                                        aria-label={isPasswordConfirmVisible ? msgStr("hidePassword") : msgStr("showPassword")}
                                        aria-controls="password-confirm"
                                        onClick={() => setIsPasswordConfirmVisible(value => !value)}
                                    >
                                        {isPasswordConfirmVisible ? "🙈" : "👁"}
                                    </button>
                                </div>
                                {messagesPerField.existsError("password-confirm") && (
                                    <span
                                        className="npu-field-error"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: translateHtmlMessage(messagesPerField.get("password-confirm"))
                                        }}
                                    />
                                )}
                            </div>

                            <label className="npu-remember-me" htmlFor="logout-sessions">
                                <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />
                                <span>{msg("logoutOtherSessions")}</span>
                            </label>

                            <div className="npu-update-actions">
                                <button className="npu-submit-button" type="submit">
                                    {msgStr("doSubmit")}
                                </button>
                                {isAppInitiatedAction && (
                                    <button className="npu-secondary-button" type="submit" name="cancel-aia" value="true">
                                        {msg("doCancel")}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </Template>
    );
}
