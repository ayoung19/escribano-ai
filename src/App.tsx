import React, { Children, FC, useState } from "react";
import { ALL_TEMPLATES } from "./utils";
import {
  EuiTextArea,
  EuiButton,
  EuiAccordion,
  EuiText,
  EuiLink,
  EuiListGroup,
  EuiTitle,
  EuiSpacer,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiFlyoutBody,
  EuiPanel,
  EuiHorizontalRule,
  EuiButtonIcon,
  EuiFormRow,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiImage,
} from "@elastic/eui";

export const App: FC = () => {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string>();

  return (
    <EuiPanel
      hasShadow={false}
      hasBorder={false}
      color="transparent"
      onCopy={() => {
        navigator.clipboard.readText().then((text) => setCopied(text));
      }}
    >
      {options.length === 0 ? (
        <>
          <EuiLink
            href="https://www.escribano.info/"
            target="_blank"
            external={false}
          >
            <EuiImage src="./title.png" size="m" alt="Title" />
          </EuiLink>
          <EuiSpacer size="s" />
          <EuiText>
            <p>Pon intrucciones para la inteligencia artificial.</p>
          </EuiText>
          <EuiSpacer size="s" />
          <EuiFormRow
            helpText={
              <EuiFlexGroup
                justifyContent="flexEnd"
                gutterSize="xs"
                alignItems="center"
                responsive={false}
              >
                <EuiFlexItem grow={false}>
                  <EuiIcon type="questionInCircle" color="text" />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiLink
                    onClick={() => setIsFlyoutVisible(true)}
                    color="text"
                  >
                    Ver plantillas
                  </EuiLink>
                </EuiFlexItem>
              </EuiFlexGroup>
            }
          >
            <EuiTextArea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              rows={18}
              resize="none"
              aria-label="Main text area"
            />
          </EuiFormRow>
          <EuiSpacer />
          <EuiButton
            onClick={() => {
              if (typeof chrome !== "undefined" && chrome.storage) {
                chrome.storage.local.get("useCount", ({ useCount = 0 }) => {
                  if (useCount > 1) {
                    window.open("https://www.google.com/");
                    return;
                  }

                  chrome.storage.local.set({ useCount: useCount + 1 });
                });
              } else {
                const useCount = Number(localStorage.getItem("useCount"));

                if (useCount > 1) {
                  window.open("https://www.google.com/");
                  return;
                }

                localStorage.setItem("useCount", String(useCount + 1));
              }

              setIsLoading(true);
              fetch(
                // `https://76706.wayscript.io/get?${new URLSearchParams({
                //   value: input,
                // })}`
                "https://78103.wayscript.io/get"
              )
                .then((response) => response.json())
                .then((data) => {
                  setIsLoading(false);
                  setOptions(data);
                });
            }}
            isLoading={isLoading}
            disabled={input.length === 0}
            fill={true}
            fullWidth={true}
            color="accent"
          >
            {isLoading ? "Redactando..." : "Redacta Ahora"}
          </EuiButton>
          {isFlyoutVisible && (
            <EuiFlyout
              onClose={() => setIsFlyoutVisible(false)}
              size={300}
              paddingSize="m"
            >
              <EuiFlyoutHeader hasBorder={true}>
                <EuiTitle size="s">
                  <h2>Elige una plantilla</h2>
                </EuiTitle>
              </EuiFlyoutHeader>
              <EuiFlyoutBody>
                {Children.toArray(
                  Object.entries(
                    ALL_TEMPLATES.reduce((acc, template) => {
                      if (!acc[template.category]) {
                        acc[template.category] = [];
                      }
                      acc[template.category].push(template);
                      return acc;
                    }, {} as { [key: string]: Template[] })
                  ).map(([category, templates]) => (
                    <>
                      <EuiAccordion
                        id={"lmao"}
                        buttonContent={
                          <EuiText size="m">
                            <h5>{category}</h5>
                          </EuiText>
                        }
                        paddingSize="none"
                      >
                        <EuiListGroup
                          listItems={templates.map((template) => ({
                            label: template.subcategory,
                            onClick: () => {
                              setInput(template.content);
                              setIsFlyoutVisible(false);
                            },
                            size: "s",
                            color: "text",
                          }))}
                        />
                      </EuiAccordion>
                      <EuiSpacer size="s" />
                    </>
                  ))
                )}
              </EuiFlyoutBody>
            </EuiFlyout>
          )}
        </>
      ) : (
        <>
          <EuiButtonIcon
            onClick={() => setOptions([])}
            color="text"
            iconType="sortLeft"
            aria-label="Back button"
          />
          <EuiSpacer size="m" />
          {Children.toArray(
            options.map((option, i) => (
              <>
                {i > 0 && <EuiHorizontalRule />}
                <EuiText size="s">
                  <p>{option}</p>
                </EuiText>
                <EuiSpacer size="m" />
                <EuiFlexGroup
                  justifyContent="flexEnd"
                  gutterSize="none"
                  responsive={false}
                >
                  <EuiFlexItem grow={false}>
                    <EuiButton
                      onClick={() => {
                        navigator.clipboard.writeText(option).then(() => {
                          setCopied(option);
                        });
                      }}
                      fill={copied === option}
                      color="accent"
                      size="s"
                      iconType="copy"
                      iconSide="right"
                    >
                      {copied === option ? "Copiado" : "Copiar"}
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </>
            ))
          )}
        </>
      )}
    </EuiPanel>
  );
};
