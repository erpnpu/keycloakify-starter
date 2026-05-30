import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { ClassKey } from "keycloakify/login";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import npuLogoUrl from "../assets/NPU_logo-DzsWpayW.png";
import erpLogoUrl from "../assets/ERPLOGO-ChsBTKyw.svg";
import googleIconUrl from "../assets/google.svg";
import facebookIconUrl from "../assets/facebook.svg";
import githubIconUrl from "../assets/github.svg";
import appleIconUrl from "../assets/apple.svg";
import lineIconUrl from "../assets/line.svg";
import thaidIconUrl from "../assets/thaid.png";
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
        case "Please re-authenticate to continue":
        case "Please re-authenticate to continue.":
            return "กรุณายืนยันตัวตนอีกครั้งเพื่อดำเนินการต่อ";
        case "Invalid username or password.":
        case "Invalid username or password":
            return "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
        case "Account is disabled, contact your administrator.":
            return "บัญชีผู้ใช้นี้ถูกปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ";
        case "Account is not fully set up":
            return "บัญชีผู้ใช้ยังตั้งค่าไม่สมบูรณ์";
        case "Email verification required":
            return "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ";
        case "The time allotted for the connection has elapsed.<br/>The login process will restart from the beginning.":
        case "The time allotted for the connection has elapsed. The login process will restart from the beginning.":
            return "หมดเวลาการเชื่อมต่อแล้ว<br/>ระบบจะเริ่มกระบวนการเข้าสู่ระบบใหม่อีกครั้ง";
        default:
            return summary;
    }
}

function translateHtmlMessage(summary: string): string {
    return kcSanitize(translateMessageSummary(summary));
}

function getSocialProviderDisplayName(displayName: string | undefined, fallbackName: string): string {
    const normalizedDisplayName = (displayName ?? "").trim().replace(/^##\s*/, "");

    return normalizedDisplayName || fallbackName;
}

function getSocialProviderIconUrl(providerAlias: string, providerId: string): string | undefined {
    const providerKey = (providerAlias || providerId).trim().toLowerCase();

    if (providerKey.includes("google")) {
        return googleIconUrl;
    }

    if (providerKey.includes("facebook")) {
        return facebookIconUrl;
    }

    if (providerKey.includes("github")) {
        return githubIconUrl;
    }

    if (providerKey.includes("apple")) {
        return appleIconUrl;
    }

    if (providerKey.includes("line")) {
        return lineIconUrl;
    }

    return undefined;
}

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, classes } = props;

    const { realm, url, usernameHidden, login, auth, social, messagesPerField } = kcContext;

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

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
            displayMessage={!messagesPerField.existsError("username", "password")}
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
                                <span>ลงชื่อเข้าสู่ระบบ</span>
                            </h3>
                            <p className="npu-form-subtitle">เข้าสู่ระบบด้วยบัญชีมหาวิทยาลัยของคุณเพื่อดำเนินการต่อ</p>
                        </div>

                        {realm.password && (
                            <form
                                className="npu-login-form"
                                id="kc-form-login"
                                action={url.loginAction}
                                method="post"
                                onSubmit={() => {
                                    setIsLoginButtonDisabled(true);
                                    return true;
                                }}
                            >
                                {usernameHidden && auth?.showUsername && auth.attemptedUsername && (
                                    <div className="npu-current-user" aria-label="ชื่อผู้ใช้ปัจจุบัน">
                                        <div className="npu-current-user-header">
                                            <div className="npu-current-user-copy">
                                                <span className="npu-current-user-label">ผู้ใช้งานปัจจุบัน</span>
                                                <strong className="npu-current-user-value">{auth.attemptedUsername}</strong>
                                            </div>
                                            <a className="npu-change-user-button" href={url.loginRestartFlowUrl}>
                                                เปลี่ยนผู้ใช้
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {!usernameHidden && (
                                    <div className="npu-form-field">
                                        <label htmlFor="username">ชื่อผู้ใช้หรืออีเมล</label>
                                        <input
                                            autoFocus
                                            autoComplete="username"
                                            defaultValue={login.username ?? ""}
                                            id="username"
                                            name="username"
                                            type="text"
                                            aria-invalid={messagesPerField.existsError("username", "password")}
                                            placeholder="กรอกชื่อผู้ใช้หรืออีเมล"
                                        />
                                        {messagesPerField.existsError("username", "password") && (
                                            <span
                                                className="npu-field-error"
                                                aria-live="polite"
                                                dangerouslySetInnerHTML={{
                                                    __html: translateHtmlMessage(
                                                        messagesPerField.getFirstError("username", "password")
                                                    )
                                                }}
                                            />
                                        )}
                                    </div>
                                )}

                                <div className="npu-form-field">
                                    <label htmlFor="password">รหัสผ่าน</label>
                                    <div className="npu-password-field">
                                        <input
                                            autoComplete="current-password"
                                            id="password"
                                            name="password"
                                            type={isPasswordVisible ? "text" : "password"}
                                            aria-invalid={messagesPerField.existsError("username", "password")}
                                            placeholder="กรอกรหัสผ่าน"
                                        />
                                        <button
                                            className="npu-password-toggle"
                                            type="button"
                                            aria-label={isPasswordVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                                            aria-controls="password"
                                            onClick={() => setIsPasswordVisible(value => !value)}
                                        >
                                            {isPasswordVisible ? (
                                                <svg viewBox="0 0 24 24" focusable="false" aria-hidden>
                                                    <path d="M12 6a9.77 9.77 0 0 1 8.82 5.5 9.65 9.65 0 0 1-2.41 3.17l1.42 1.42A11.77 11.77 0 0 0 23 12a11.83 11.83 0 0 0-16.18-4.36l1.46 1.46A9.66 9.66 0 0 1 12 6Zm-9.19-.19 2.13 2.13.43.43A11.8 11.8 0 0 0 1 12a11.82 11.82 0 0 0 15.38 6.11l.42.42 2.72 2.72 1.27-1.27L4.08 4.54ZM12 18a9.78 9.78 0 0 1-8.82-5.5 9.9 9.9 0 0 1 3.41-3.83l1.57 1.57A3.94 3.94 0 0 0 8 11a4 4 0 0 0 5 3.87l1.98 1.98A9.6 9.6 0 0 1 12 18Zm0-3a3 3 0 0 1-3-3 2.9 2.9 0 0 1 .18-1l3.82 3.82A2.9 2.9 0 0 1 12 15Zm2.94-1.06-4.88-4.88A3 3 0 0 1 15 12a2.9 2.9 0 0 1-.06.94Z" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" focusable="false" aria-hidden>
                                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Zm0 13a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11Zm0-2.2a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6Z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {usernameHidden && messagesPerField.existsError("username", "password") && (
                                        <span
                                            className="npu-field-error"
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: translateHtmlMessage(
                                                    messagesPerField.getFirstError("username", "password")
                                                )
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="npu-form-row">
                                    {realm.rememberMe && !usernameHidden ? (
                                        <label className="npu-remember-me" htmlFor="rememberMe">
                                            <input
                                                defaultChecked={!!login.rememberMe}
                                                id="rememberMe"
                                                name="rememberMe"
                                                type="checkbox"
                                            />
                                            <span>จดจำการเข้าสู่ระบบ</span>
                                        </label>
                                    ) : (
                                        <span />
                                    )}

                                    {realm.resetPasswordAllowed && (
                                        <a className="npu-text-link" href={url.loginResetCredentialsUrl}>
                                            ลืมรหัสผ่าน?
                                        </a>
                                    )}
                                </div>

                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />

                                <button className="npu-submit-button" disabled={isLoginButtonDisabled} id="kc-login" name="login" type="submit">
                                    เข้าสู่ระบบ
                                </button>
                            </form>
                        )}

                        {social?.providers?.length ? (
                            <section className="npu-social-login" aria-label="เข้าสู่ระบบด้วยผู้ให้บริการอื่น">
                                <div className="npu-social-divider" aria-hidden="true">
                                    <span />
                                    <strong>หรือเข้าสู่ระบบด้วย</strong>
                                    <span />
                                </div>

                                <div className="npu-social-grid">
                                    {social.providers.map(provider => {
                                        const alias = (provider.alias ?? "").trim().toLowerCase();
                                        const isThaidProvider = alias === "thaid";
                                        const providerName = getSocialProviderDisplayName(
                                            provider.displayName,
                                            provider.alias || provider.providerId
                                        );
                                        const iconUrl = isThaidProvider
                                            ? thaidIconUrl
                                            : getSocialProviderIconUrl(provider.alias, provider.providerId);

                                        return (
                                            <a
                                                key={provider.alias}
                                                className={`npu-social-button${isThaidProvider ? " npu-social-button--thaid" : ""}`}
                                                href={provider.loginUrl}
                                                id={`social-${provider.alias}`}
                                                aria-label={`เข้าสู่ระบบด้วย ${providerName}`}
                                                title={providerName}
                                            >
                                                {iconUrl !== undefined && (
                                                    <img
                                                        className={`npu-social-icon${isThaidProvider ? " npu-social-icon--thaid" : ""}`}
                                                        src={iconUrl}
                                                        alt=""
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                {!isThaidProvider && (
                                                    <span
                                                        className="npu-social-button-text"
                                                        dangerouslySetInnerHTML={{
                                                            __html: kcSanitize(providerName)
                                                        }}
                                                    />
                                                )}
                                            </a>
                                        );
                                    })}
                                </div>
                            </section>
                        ) : null}
                    </div>
                </section>
            </div>
        </Template>
    );
}