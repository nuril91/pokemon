import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };
    static getDerivedStateFromError(err: Error) {
        return { hasError: true, message: err.message };
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? (
                <div className="p-4 rounded-xl2 bg-red-50 text-red-700">
                    Something went wrong: {this.state.message}
                </div>
            );
        }
        return this.props.children;
    }
}