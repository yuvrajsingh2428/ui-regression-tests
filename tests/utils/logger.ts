/**
 * Structured Logger for Test Execution
 * 
 * Provides clear, timestamped logs to help debug CI/CD failures.
 * Adds context like "Test Step" or "Visual Check".
 */

export class Logger {
    static info(step: string, message: string) {
        console.log(`[INFO] [${new Date().toISOString()}] [${step}]: ${message}`);
    }

    static error(step: string, message: string, error?: any) {
        console.error(`[ERROR] [${new Date().toISOString()}] [${step}]: ${message}`);
        if (error) {
            console.error(error);
        }
    }

    static success(step: string, message: string) {
        console.log(`[PASS] [${new Date().toISOString()}] [${step}]: ${message}`);
    }

    static step(message: string) {
        console.log(`\n🔹 STEP: ${message}`);
    }
}
