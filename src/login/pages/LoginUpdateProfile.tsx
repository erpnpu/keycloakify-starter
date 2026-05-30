import { useState } from "react";
import type { JSX } from "keycloakify/tools/JSX";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { ClassKey } from "keycloakify/login";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import npuLogoUrl from "../assets/NPU_logo-DzsWpayW.png";
import erpLogoUrl from "../assets/ERPLOGO-ChsBTKyw.svg";
import "./login.css";

type LoginUpdateProfileProps = PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

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
    kcFormGroupClass: "npu-form-field",
    kcContentWrapperClass: "npu-content-wrapper",
    kcAlertClass: "npu-alert",
    kcAlertTitleClass: "npu-alert-title",
    kcSignUpClass: "npu-signup",
    kcInfoAreaWrapperClass: "npu-signup-wrapper",
    kcFormClass: "npu-login-form npu-update-profile-form",
    kcLabelWrapperClass: "npu-label-wrapper",
    kcLabelClass: "npu-field-label",
    kcInputWrapperClass: "npu-input-wrapper",
    kcInputClass: "npu-input-control",
    kcInputErrorMessageClass: "npu-field-error",
    kcInputHelperTextBeforeClass: "npu-input-helper",
    kcInputHelperTextAfterClass: "npu-input-helper",
    kcFormButtonsClass: "npu-update-actions",
    kcFormOptionsClass: "npu-form-options",
    kcFormOptionsWrapperClass: "npu-form-options-wrapper",
    kcButtonClass: "npu-action-button",
    kcButtonPrimaryClass: "npu-submit-button",
    kcButtonDefaultClass: "npu-secondary-button",
    kcButtonBlockClass: "npu-button-block",
    kcInputGroup: "npu-password-field",
    kcFormPasswordVisibilityButtonClass: "npu-password-toggle",
    kcFormPasswordVisibilityIconShow: "npu-password-icon-show",
    kcFormPasswordVisibilityIconHide: "npu-password-icon-hide",
    kcFormGroupHeader: "npu-form-group-header"
} satisfies Partial<Record<ClassKey, string>>;

function translateMessageSummary(summary: string): string {
    switch (summary.trim()) {
        case "Invalid email format":
            return "รูปแบบอีเมลไม่ถูกต้อง";
        default:
            return summary;
    }
}

export default function LoginUpdateProfile(props: LoginUpdateProfileProps) {
    const { kcContext, i18n, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;
    const { messagesPerField, url, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    const mergedClasses = {
        ...(classes ?? {}),
        ...templateClasses
    };

    const { kcClsx } = getKcClsx({
        doUseDefaultCss: false,
        classes: mergedClasses
    });

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
            classes={mergedClasses}
            headerNode={null}
            bodyClassName="npu-login-body"
            displayMessage={messagesPerField.exists("global")}
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
                                <span>{msg("loginProfileTitle")}</span>
                            </h3>
                            <p className="npu-form-subtitle">กรุณาตรวจสอบและอัปเดตข้อมูลโปรไฟล์ก่อนดำเนินการต่อ</p>
                        </div>

                        <form id="kc-update-profile-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                            <UserProfileFormFields
                                kcContext={kcContext}
                                i18n={i18n}
                                kcClsx={kcClsx}
                                onIsFormSubmittableValueChange={setIsFormSubmittable}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />

                            <div className={kcClsx("kcFormGroupClass")}>
                                <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                                    <div className={kcClsx("kcFormOptionsWrapperClass")} />
                                </div>

                                <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                                    <input
                                        disabled={!isFormSubmittable}
                                        className={kcClsx(
                                            "kcButtonClass",
                                            "kcButtonPrimaryClass",
                                            !isAppInitiatedAction && "kcButtonBlockClass",
                                            "kcButtonLargeClass"
                                        )}
                                        type="submit"
                                        value={msgStr("doSubmit")}
                                    />
                                    {isAppInitiatedAction && (
                                        <button
                                            className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonLargeClass")}
                                            type="submit"
                                            name="cancel-aia"
                                            value="true"
                                            formNoValidate
                                        >
                                            {msg("doCancel")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </Template>
    );
}
