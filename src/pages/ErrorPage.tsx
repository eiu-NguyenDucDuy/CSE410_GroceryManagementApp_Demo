import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    let title = "Something went wrong!";
    let message = "An unexpected error has occurred.";

    if (isRouteErrorResponse(error)) {
        title = error.status.toString();
        message = error.statusText || "Unknown error";
    }

    return (
        <>
            <div className="text-center p-5 text-xl">
                <h1 className="text-xl text-slate-900">{title}</h1>
                <p className="text-base text-slate-700">{message}</p>
            </div>
        </>
    );
}
