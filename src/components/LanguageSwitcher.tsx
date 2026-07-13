import { Select } from "antd";
import useLanguage from "../hooks/useLanguage";
import { TranslationOutlined } from "@ant-design/icons";
import { languages } from "../config/languages";

type Props = {
    darkMode: boolean;
};

export default function LanguageSwitcher({ darkMode }: Props) {
    const { language, setLanguage } = useLanguage();

    return (
        <Select
            prefix={<TranslationOutlined style={{ color: "#69f" }} />}
            value={language}
            style={{ width: 120 }}
            options={Object.entries(languages).map(([value, config]) => ({
                value,
                label: config.label,
            }))}
            onChange={setLanguage}
            variant={darkMode ? "filled" : "outlined"}
        />
    );
}
