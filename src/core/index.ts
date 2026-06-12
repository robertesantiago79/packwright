export interface StubCompileResult {
  status: "stub";
  intake: unknown;
}

export interface ContextEngine {
  compile(intake: unknown): Promise<StubCompileResult>;
}

export const engine: ContextEngine = {
  compile(intake: unknown): Promise<StubCompileResult> {
    return Promise.resolve({
      status: "stub",
      intake,
    });
  },
};
