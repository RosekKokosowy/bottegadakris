import "server-only";

export function log(src: string, error: unknown, hint?: string): void {
    const timestamp: string = new Date().toISOString();
    const message: string = extractMessage(error);
    const stackTrace = (error instanceof Error && error.stack) ? error.stack : "No stack trace available";

    const logEntry = `
        ---------------------------------------------------------------------------------------------------
            EXCEPTION DETECTED ON SERVER SIDE
            {
                timestamp: ${timestamp}
                source: ${src}
                exceptionType: ${error instanceof Error ? error.constructor.name : "Unknown Error"}
                message: ${message}
                hint: ${hint || "No hint provided"}
                stackTrace:
                ${stackTrace.split("\n").join("\n  ")}
            }
        ---------------------------------------------------------------------------------------------------
    `;

    console.log(logEntry);
}

const extractMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "An unknown error occurred";
}
