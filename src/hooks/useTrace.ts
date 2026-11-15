'use client';

export const useTrace = () => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extractMessage = (error: any): string => {
        if (error?.message) return error.message;
        if (typeof error === 'string') return error;
        return 'An unknown error occurred';
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const log = (src: string, error: any, hint?: string): void => {
        const timestamp: string = new Date().toISOString();
        const message: string = extractMessage(error);
        const stackTrace = error?.stack || "No stack trace available";

        console.log("---------------------------------------------------------------------------------------------------");
        console.log("EXCEPTION DETECTED ON CLIENT SIDE");
        console.log("{");
        console.log(`  timestamp: ${timestamp}`);
        console.log(`  source: ${src}`);
        console.log(`  exceptionType: ${error?.constructor?.name || "UnknownError"}`);
        console.log(`  message: ${message}`);
        console.log(`  hint: ${hint || "No hint provided"}`);
        console.log("  stackTrace:");
        console.log("  " + stackTrace.split("\n").join("\n  "));
        console.log("}");
        console.log("---------------------------------------------------------------------------------------------------");
    };

    return { log };
};
