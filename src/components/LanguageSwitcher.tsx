import { Select } from "antd";
import useLanguage from "../hooks/useLanguage";
import { TranslationOutlined } from "@ant-design/icons";

type Props = {
    darkMode: boolean;
};

export default function LanguageSwitcher({ darkMode }: Props) {
    const { language, setLanguage } = useLanguage();

    return (
        <Select
            prefix={<TranslationOutlined style={{ color: "#69f" }} />}
            value={language}
            style={{
                width: 90,
            }}
            options={[
                {
                    label: "EN",
                    value: "en",
                },
                {
                    label: "VN",
                    value: "vi",
                },
            ]}
            onChange={setLanguage}
            variant={darkMode ? "filled" : "outlined"}
        />
    );
}
