import Routes from "./Routes";
import { AuthProvider } from "./providers/AuthProvider";

export default function App() {
    return (
        <AuthProvider>
            <Routes />
        </AuthProvider>
    );
}
