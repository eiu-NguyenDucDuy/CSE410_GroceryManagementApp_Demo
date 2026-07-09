import { ConfigProvider } from "antd";
import useTheme from "../context/useTheme";
import App from "../App";

export default function ThemedApp() {
    const { antdTheme } = useTheme();

    return (
        <ConfigProvider theme={antdTheme}>
            <App />
        </ConfigProvider>
    );
}
