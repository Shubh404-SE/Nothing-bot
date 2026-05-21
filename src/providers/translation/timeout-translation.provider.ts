import { withTimeout } from "../../shared/async/with-timeout.js";
import type {
  TranslateParams,
  TranslateResult,
  TranslationProvider,
} from "./translation-provider.interface.js";

export class TimeoutTranslationProvider implements TranslationProvider {
  constructor(
    private readonly inner: TranslationProvider,
    private readonly timeoutMs: number,
  ) {}

  async translate(params: TranslateParams): Promise<TranslateResult> {
    return withTimeout(this.inner.translate(params), this.timeoutMs, "translation");
  }
}
