import Routes from "./Routes";
import { AuthProvider } from "./context/AuthProvider";

export default function App() {
    return (
        <AuthProvider>
            <Routes />
        </AuthProvider>
    );
}
