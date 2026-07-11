import { ConfigProvider, App as AntdApp } from "antd";
import App from "../App";
import useTheme from "../hooks/useTheme";
import useLanguage from "../hooks/useLanguage";

export default function ThemedApp() {
    const { antdTheme } = useTheme();
    const { locale } = useLanguage();

    return (
        <ConfigProvider locale={locale} theme={antdTheme}>
            <AntdApp>
                <App />
            </AntdApp>
        </ConfigProvider>
    );
}
